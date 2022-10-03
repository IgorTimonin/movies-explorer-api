const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Требуется аутентификация');
  }
  let tokenVerify;

  try {
    tokenVerify = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    if (tokenVerify) {
      req.user = tokenVerify;
    }
  } catch (err) {
    throw new UnauthorizedError(`Неверный токен ${err}`);
  }
  next();
};
