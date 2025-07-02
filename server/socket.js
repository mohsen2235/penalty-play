const { Server } = require('socket.io');
const chessModule = require('./chess'); // برای شطرنج
const bettingModule = require('./betting'); // برای شرط‌بندی

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.NODE_ENV === 'development' ? '*' : process.env.WEBAPP_URL }, // CORS پویا
  });
  const gameNS = io.of('/game'); // برای پنالتی
  const chessNS = chessModule(server); // برای شطرنج

  // منطق پنالتی
  gameNS.on('connection', (socket) => {
    console.log('User connected to /game namespace:', socket.id);

    socket.on('join', (gameId) => {
      if (!gameId) return socket.emit('error', 'Game ID is required');
      socket.join(gameId);
      socket.emit('joined', { gameId, message: 'Joined penalty game' });
    });

    socket.on('joinQueue', (data) => {
      if (!data || !data.userId) return socket.emit('error', 'User ID is required');
      io.emit('queueUpdate', { userId: data.userId, timestamp: Date.now() });
    });

    socket.on('sendChallenge', (data) => {
      if (!data || !data.to) return socket.emit('error', 'Recipient is required');
      gameNS.to(data.to).emit('incomingChallenge', { from: socket.id, ...data });
    });

    socket.on('challengeAccepted', (data) => {
      if (!data || !data.challenger) return socket.emit('error', 'Challenger ID is required');
      gameNS.to(data.challenger).emit('challengeAccepted', { from: socket.id, ...data });
    });

    socket.on('chatMessage', (msg) => {
      if (!msg || !msg.content) return socket.emit('error', 'Message content is required');
      gameNS.emit('chatMessage', { userId: socket.id, content: msg.content, timestamp: Date.now() });
    });

    socket.on('shot', (data) => {
      if (!data || !data.gameId) return socket.emit('error', 'Game ID is required');
      gameNS.to(data.gameId).emit('shot', { userId: socket.id, ...data });
    });

    socket.on('score', (data) => {
      if (!data || !data.gameId || data.score === undefined) return socket.emit('error', 'Score and Game ID are required');
      gameNS.to(data.gameId).emit('score', { userId: socket.id, ...data });
    });

    socket.on('gameUpdate', (data) => {
      if (!data || !data.gameId) return socket.emit('error', 'Game ID is required');
      gameNS.emit('gameUpdate', { gameId: data.gameId, ...data });
    });

    socket.on('placeBet', async (data) => {
      if (!data || !data.gameId || !data.userId || !data.amount) {
        return socket.emit('error', 'Game ID, User ID, and amount are required');
      }
      try {
        const result = await bettingModule.placeBet(data.gameId, data.userId, data.amount);
        socket.emit('betPlaced', result);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from /game namespace:', socket.id);
    });
  });

  return io;
};