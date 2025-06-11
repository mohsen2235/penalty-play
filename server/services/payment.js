const { sendUSDT } = require('./tron');
const feeWallet = process.env.GAME_FEE_WALLET;
const feePercent = parseFloat(process.env.GAME_FEE_PERCENT);
async function distributePrize({addrA,addrB,totalBet,winner}) {
  if (winner==='TIE') {
    await Promise.all([ sendUSDT(addrA,totalBet/2), sendUSDT(addrB,totalBet/2) ]);
    return;
  }
  const feeAmt = totalBet*feePercent/100;
  const winAmt = totalBet - feeAmt;
  const winAddr = winner==='A'?addrA:addrB;
  await sendUSDT(feeWallet,feeAmt);
  await sendUSDT(winAddr,winAmt);
}
module.exports={distributePrize};