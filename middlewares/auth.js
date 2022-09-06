require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Требуется аутентификация');
  }
  let tokenVerefy;

  try {
    tokenVerefy = jwt.verify(
      token,
      NODE_ENV === 'development' ? JWT_SECRET : 'dev-secret',
    );
    if (tokenVerefy) {
      req.user = tokenVerefy;
    }
  } catch (err) {
    throw new UnauthorizedError(`Неверный токен ${err}`);
  }
  next();
};
