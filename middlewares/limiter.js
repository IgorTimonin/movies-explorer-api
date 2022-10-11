const limiter = require('express-rate-limit');

module.exports.rateLimiter = limiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 часа
  max: 1000,
  message: 'Превышено кол-во запросов за 24 часа с одного ip',
  standardHeaders: true,
  legacyHeaders: false,
});
