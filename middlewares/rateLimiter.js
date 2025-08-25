const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // max attempts
  message: { message: "Trop de tentatives de connexion, réessayez plus tard" },
  standardHeaders: true,
  legacyHeaders: false,
});
