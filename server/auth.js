const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const apiLimiter = rateLimit({ windowMs: 60000, max: 30 });
function jwtMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.sendStatus(403); }
}

module.exports = { apiLimiter, jwtMiddleware };