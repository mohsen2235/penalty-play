require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { apiLimiter, jwtMiddleware } = require('./auth');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/user');
const txRoutes = require('./routes/transaction');
const achRoutes = require('./routes/achievements');
const setupSocket = require('./socket');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use('/auth', apiLimiter, authRoutes);
app.use('/game', apiLimiter, jwtMiddleware, gameRoutes);
app.use('/user', apiLimiter, jwtMiddleware, userRoutes);
app.use('/transactions', apiLimiter, jwtMiddleware, txRoutes);
app.use('/achievements', apiLimiter, jwtMiddleware, achRoutes);

const server = https.createServer({
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
}, app);

setupSocket(server);

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.onText(/\/play/, msg => {
  bot.sendMessage(msg.chat.id, '🎮 Play 3D Penalty', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Play', web_app: { url: process.env.WEBAPP_URL } }
      ]]
    }
  });
});
bot.on('message', msg => {
  if (msg.web_app_data) {
    const data = JSON.parse(msg.web_app_data.data);
    server.of('/game').to(msg.chat.id).emit('webData', data);
  }
});

server.listen(process.env.PORT, () => console.log('Server on', process.env.PORT));