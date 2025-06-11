const express = require('express');
const { apiLimiter, jwtMiddleware } = require('../auth');
const { getWaitingUsers, createGame } = require('../models/game');
const { distributePrize } = require('../services/payment');
const db = require('../db');
const { logTransaction } = require('../models/transaction');
const router = express.Router();
router.use(apiLimiter, jwtMiddleware);
router.get('/waiting-users', async (req, res) => { res.json(await getWaitingUsers()); });
router.post('/match', async (req, res) => {
  const { bet } = req.body;
  const gameId = await createGame(req.user.telegram_id, bet);
  res.json({ gameId });
});
router.post('/finish', async (req, res) => {
  const { gameId, playerA, playerB, totalBet, result, stats } = req.body;
  if (Array.isArray(stats)) {
    const vals = stats.map(s => `(${gameId},${s.round},${s.successRate})`).join(',');
    await db.query(`INSERT INTO game_stats(game_id,round,success_rate) VALUES ${vals}`);
  }
  await distributePrize({ addrA: playerA, addrB: playerB, totalBet, winner: result });
  res.json({ success: true });
});
module.exports = router;