const express = require('express');
const multer = require('multer');
const path = require('path');
const { jwtMiddleware } = require('../auth');
const { getUserProfile,	updateProfileImage } = require('../models/user');
const { getBalance, depositUSDT, withdrawUSDT } =	require('../models/wallet');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${req.user.telegram_id}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });
const router = express.Router();
router.use(jwtMiddleware);
router.get('/profile', async (req, res) => { res.json(await getUserProfile(req.user.telegram_id)); });
router.post('/profile/avatar', upload.single('avatar'), async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  await updateProfileImage(req.user.telegram_id, url);
  res.json({ imageUrl: url });
});
router.get('/wallet', async (req, res) => { res.json({ balance: await getBalance(req.user.telegram_id) }); });
router.post('/wallet/deposit', async (req, res) => {
  await depositUSDT(req.user.telegram_id, req.body.amount);
  res.json({ balance: await getBalance(req.user.telegram_id) });
});
router.post('/wallet/withdraw', async (req, res) => {
  await withdrawUSDT(req.user.telegram_id, req.body.toAddress, req.body.amount);
  res.json({ balance: await getBalance(req.user.telegram_id) });
});
module.exports = router;
