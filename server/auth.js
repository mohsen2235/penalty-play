const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const apiLimiter = rateLimit({
  windowMs: 60000, // 1 دقیقه
  max: 30, // 30 درخواست
  message: 'Too many requests, please try again later.', // پیام خطا
  standardHeaders: true, // هدرهای استاندارد X-Rate-Limit
  legacyHeaders: false, // غیرفعال کردن هدرهای قدیمی
});

function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token', details: err.message });
  }
}

module.exports = { apiLimiter, jwtMiddleware };