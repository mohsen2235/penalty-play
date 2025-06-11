const TronWeb = require('tronweb');
const fullHost = process.env.NODE_ENV==='production'
  ? 'https://api.trongrid.io'
  : 'https://nile.trongrid.io';
const tronWeb = new TronWeb({ fullHost, privateKey:	process.env.TRON_PRIVATE_KEY });
const USDT = process.env.USDT_CONTRACT_ADDRESS;
let usdtContract;
(async()=>{
  try { usdtContract = await tronWeb.contract().at(USDT); }
  catch(e){ console.error(e); }
})();
module.exports = {
  tronWeb,
  async sendUSDT(to,amt){ return await usdtContract.transfer(to,amt).send(); },
  async getUSDTBalance(addr){ const b = await usdtContract.balanceOf(addr).call(); return parseInt(b)/1e6; },
  async validateDeposit(addr,exp){ /* ... */ }
};
