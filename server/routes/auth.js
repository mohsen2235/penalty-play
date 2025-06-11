const express = require('express'), jwt = require('jsonwebtoken');
const { createUser } = require('../models/game');
const router = express.Router();
router.post('/login', async (req, res) => {
  const { telegram_id } = req.body;
  await createUser(telegram_id);
  const token = jwt.sign({ telegram_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});
module.exports = router;