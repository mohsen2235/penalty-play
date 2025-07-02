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
const chessModule = require('./chess');
const bettingModule = require('./betting');

// چک متغیرهای محیطی
if (!process.env.WEBAPP_URL || !process.env.BOT_TOKEN) {
  console.error('Missing required environment variables: WEBAPP_URL or BOT_TOKEN');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// میدلور لاگ درخواست
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint انتخاب بازی
app.get('/select-game', (req, res) => {
  const game = req.query.game;
  if (!game || !['penalty', 'chess'].includes(game)) {
    return res.status(400).json({ error: 'Invalid game. Use "penalty" or "chess"' });
  }
  res.json({ game, message: 'Game selected successfully' });
});

// روت‌های API
app.use('/auth', apiLimiter, authRoutes);
app.use('/game', apiLimiter, jwtMiddleware, gameRoutes);
app.use('/user', apiLimiter, jwtMiddleware, userRoutes);
app.use('/transactions', apiLimiter, jwtMiddleware, txRoutes);
app.use('/achievements', apiLimiter, jwtMiddleware, achRoutes);

// تست دیتابیس
app.get('/test-db', async (req, res) => {
  try {
    const { Pool } = require('./db');
    const pool = new Pool();
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const server = https.createServer({
  // مسیر گواهی‌ها (فعلاً کامنت شده برای تست بدون SSL)
  // key: fs.readFileSync(process.env.KEY_PATH || './certs/key.pem'),
  // cert: fs.readFileSync(process.env.CERT_PATH || './certs/cert.pem')
}, app);

// راه‌اندازی Socket.io برای پنالتی و شطرنج
setupSocket(server);
chessModule(server);

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.onText(/\/play/, (msg) => {
  bot.sendMessage(msg.chat.id, '🎮 Choose your game:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Penalty', web_app: { url: `${process.env.WEBAPP_URL}?game=penalty` } },
          { text: 'Chess', web_app: { url: `${process.env.WEBAPP_URL}?game=chess` } }
        ]
      ]
    }
  });
});
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    const data = JSON.parse(msg.web_app_data.data);
    const gameNS = data.game === 'chess' ? server.of('/chess') : server.of('/game');
    gameNS.to(msg.chat.id).emit('webData', data);
    // اضافه کردن داده‌های سه‌بعدی (اگه کلاینت بفرسته)
    if (data.position) gameNS.to(msg.chat.id).emit('3dPosition', data.position);
  }
});

// پورت 3000 برای HTTP (تست بدون SSL)
app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));

// پورت 443 برای HTTPS (فعلاً غیرفعال)
/*
server.listen(process.env.PORT || 443, () => {
  console.log('HTTPS server running on port', process.env.PORT || 443);
});