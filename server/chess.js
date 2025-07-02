const { Server } = require('socket.io');

module.exports = (server) => {
  const chessNS = new Server(server, {
    cors: { origin: process.env.NODE_ENV === 'development' ? '*' : process.env.WEBAPP_URL },
  });

  // آرایه 8×8 برای صفحه شطرنج (ابتدا)
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];
  // r: رخ، n: اسب، b: فیل، q: وزیر، k: شاه، p: سرباز
  // حروف بزرگ: سفید، کوچک: سیاه

  const games = {}; // ذخیره وضعیت بازی‌ها

  chessNS.on('connection', (socket) => {
    console.log('User connected to /chess namespace:', socket.id);

    socket.on('joinGame', (data) => {
      if (!data || !data.gameId || !data.color) return socket.emit('error', 'Game ID and color are required');
      const { gameId, color } = data;
      if (!games[gameId]) {
        games[gameId] = { board: [...initialBoard], players: {}, turn: 'white' };
      }
      if (Object.keys(games[gameId].players).length >= 2) return socket.emit('error', 'Game is full');
      games[gameId].players[socket.id] = { color };
      socket.join(gameId);
      chessNS.to(gameId).emit('gameState', { gameId, board: games[gameId].board, players: games[gameId].players, turn: games[gameId].turn });
      socket.emit('joined', { gameId, message: 'Joined chess game', color });
    });

    socket.on('movePiece', (data) => {
      if (!data || !data.gameId || !data.from || !data.to || !data.userId) {
        return socket.emit('error', 'Move data (gameId, from, to, userId) is required');
      }
      const { gameId, from, to, userId } = data;
      if (!games[gameId] || !games[gameId].players[userId]) return socket.emit('error', 'Invalid game or player');

      const playerColor = games[gameId].players[userId].color;
      const currentTurn = games[gameId].turn;
      if (playerColor !== currentTurn) return socket.emit('error', 'Not your turn');

      const [fromX, fromY] = from.split(',').map(Number);
      const [toX, toY] = to.split(',').map(Number);
      const piece = games[gameId].board[fromX][fromY];

      // قوانین ساده حرکت (باید گسترش بشه)
      if (piece && piece.toLowerCase() === piece && playerColor !== 'black') return socket.emit('error', 'Not your piece');
      if (piece && piece.toUpperCase() === piece && playerColor !== 'white') return socket.emit('error', 'Not your piece');

      games[gameId].board[toX][toY] = piece;
      games[gameId].board[fromX][fromY] = ' ';
      games[gameId].turn = games[gameId].turn === 'white' ? 'black' : 'white';

      chessNS.to(gameId).emit('movePiece', { gameId, from, to, board: games[gameId].board, turn: games[gameId].turn });
      checkCheckmate(gameId); // چک کردن چک‌مِیت
    });

    socket.on('placeBet', async (data) => {
      if (!data || !data.gameId || !data.userId || !data.amount) {
        return socket.emit('error', 'Game ID, User ID, and amount are required');
      }
      try {
        const { Pool } = require('./db');
        const pool = new Pool();
        const result = await require('./betting').placeBet(data.gameId, data.userId, data.amount);
        chessNS.to(data.gameId).emit('betPlaced', { userId: data.userId, ...result });
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from /chess namespace:', socket.id);
      Object.keys(games).forEach(gameId => {
        if (games[gameId].players[socket.id]) {
          delete games[gameId].players[socket.id];
          if (Object.keys(games[gameId].players).length === 0) delete games[gameId];
          else chessNS.to(gameId).emit('gameState', { gameId, board: games[gameId].board, players: games[gameId].players });
        }
      });
    });
  });

  function checkCheckmate(gameId) {
    // لاجیک ساده برای چک‌مِیت (نیاز به گسترش داره)
    chessNS.to(gameId).emit('checkmate', { gameId, winner: games[gameId].turn === 'white' ? 'black' : 'white' });
  }

  return chessNS;
};