const { Server } = require('socket.io');

module.exports = (server) => {
  const chessNS = new Server(server, {
    cors: { origin: process.env.NODE_ENV === 'development' ? '*' : process.env.WEBAPP_URL },
  });

  chessNS.on('connection', (socket) => {
    console.log('User connected to /chess namespace:', socket.id);

    socket.on('joinGame', (gameId) => {
      if (!gameId) return socket.emit('error', 'Game ID is required');
      socket.join(gameId);
      socket.emit('joined', { gameId, message: 'Joined chess game' });
    });

    socket.on('movePiece', (data) => {
      if (!data || !data.from || !data.to || !data.gameId) {
        return socket.emit('error', 'Move data (from, to, gameId) is required');
      }
      chessNS.to(data.gameId).emit('movePiece', { userId: socket.id, ...data });
    });

    socket.on('checkmate', (data) => {
      if (!data || !data.gameId || !data.winner) {
        return socket.emit('error', 'Game ID and winner are required');
      }
      chessNS.to(data.gameId).emit('checkmate', { winner: data.winner, ...data });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from /chess namespace:', socket.id);
    });
  });

  return chessNS;
};