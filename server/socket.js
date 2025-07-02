const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.NODE_ENV === 'development' ? '*' : process.env.WEBAPP_URL }, // CORS پویا
  });
  const gameNS = io.of('/game');

  gameNS.on('connection', (socket) => {
    console.log('User connected to /game namespace:', socket.id);

    socket.on('join', (gameId) => {
      if (!gameId) return socket.emit('error', 'Game ID is required');
      socket.join(gameId);
      socket.emit('joined', { gameId, message: 'Joined game successfully' });
    });

    socket.on('joinQueue', (data) => {
      if (!data || !data.userId) return socket.emit('error', 'User ID is required');
      io.emit('queueUpdate', { userId: data.userId, timestamp: Date.now() }); // داده نمونه
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

    socket.on('disconnect', () => {
      console.log('User disconnected from /game namespace:', socket.id);
    });
  });

  return io;
};