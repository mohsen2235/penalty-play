const { Server } = require('socket.io');
module.exports = server => {
  const io = new Server(server, { cors:{ origin:'*' } });
  const gameNS = io.of('/game');
  gameNS.on('connection', socket => {
    socket.on('join', gameId => socket.join(gameId));
    socket.on('joinQueue', data => io.emit('queueUpdate', /* ... */));
    socket.on('sendChallenge', data => gameNS.to(data.to).emit('incomingChallenge', data));
    socket.on('challengeAccepted', data => gameNS.to(data.challenger).emit('challengeAccepted', data));
    socket.on('chatMessage', msg => gameNS.emit('chatMessage', msg));
    socket.on('shot', data => gameNS.to(data.gameId).emit('shot', data));
    socket.on('score', data => gameNS.to(data.gameId).emit('score', data));
    socket.on('gameUpdate', data => gameNS.emit('gameUpdate', data));
  });
  return io;
};