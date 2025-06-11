const express = require('express');
const { jwtMiddleware } = require('../auth');
const { logTransaction, getTransactions } = require('../models/transaction');
const router = express.Router();
router.use(jwtMiddleware);
router.get('/', async (req, res) => { res.json(await getTransactions(req.user.telegram_id)); });
module.exports = router;