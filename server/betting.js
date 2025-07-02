const tronWeb = require('tronweb');
const pool = require('./db');

module.exports = {
  placeBet: async (gameId, userId, amount) => {
    if (!gameId || !userId || !amount) {
      throw new Error('Game ID, User ID, and amount are required');
    }
    if (amount < process.env.MIN_BET || amount > process.env.MAX_BET) {
      throw new Error(`Bet amount must be between ${process.env.MIN_BET} and ${process.env.MAX_BET}`);
    }

    const tron = new tronWeb({
      fullHost: process.env.TRON_FULL_NODE,
      privateKey: process.env.TRON_PRIVATE_KEY,
    });

    const feeWallet = process.env.GAME_FEE_WALLET;
    const feePercent = parseInt(process.env.GAME_FEE_PERCENT) || 20;
    const feeAmount = (amount * feePercent) / 100;
    const userAmount = amount - feeAmount;

    // شبیه‌سازی تراکنش (تست محلی)
    console.log(`Bet: ${amount}, Fee: ${feeAmount}, User Amount: ${userAmount}`);
    await pool.query(
      'INSERT INTO bets (game_id, user_id, amount, fee, net_amount, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [gameId, userId, amount, feeAmount, userAmount]
    );

    return { success: true, amount, fee: feeAmount, netAmount: userAmount };
  },
};