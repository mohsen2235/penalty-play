require('dotenv').config({ path: __dirname + '/../.env' }); // لود dotenv با مسیر ریشه از دید services
const TronWeb = require('tronweb');

const fullHost = process.env.NODE_ENV === 'production'
  ? 'https://api.trongrid.io'
  : 'https://nile.trongrid.io';
const privateKey = process.env.TRON_PRIVATE_KEY;
const USDT = process.env.USDT_CONTRACT_ADDRESS;

// دیباگ برای چک کردن مقدار
console.log('TRON_PRIVATE_KEY from env:', privateKey);

if (!privateKey) {
  throw new Error('TRON_PRIVATE_KEY is not set in .env');
}
if (!USDT) {
  throw new Error('USDT_CONTRACT_ADDRESS is not set in .env');
}

const tronWeb = new TronWeb({
  fullHost: fullHost,
  privateKey: privateKey
});

let usdtContract;
(async () => {
  try {
    usdtContract = await tronWeb.contract().at(USDT);
  } catch (e) {
    console.error('Failed to initialize USDT contract:', e);
    throw e;
  }
})();

module.exports = {
  tronWeb,
  async sendUSDT(to, amt) {
    if (!usdtContract) throw new Error('USDT contract not initialized');
    return await usdtContract.transfer(to, amt).send();
  },
  async getUSDTBalance(addr) {
    if (!usdtContract) throw new Error('USDT contract not initialized');
    const b = await usdtContract.balanceOf(addr).call();
    return parseInt(b) / 1e6;
  },
  async validateDeposit(addr, exp) {
    if (!usdtContract) throw new Error('USDT contract not initialized');
    throw new Error('validateDeposit not implemented yet');
  }
};