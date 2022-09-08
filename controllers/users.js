require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUND } = require('../configs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt
    .hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(({ _id }) => res.send({
          name,
          email,
          _id,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError('Пользователь c таким email уже существует'),
            );
          } else if (err.name === 'ValidationError') {
            next(
              new BadRequestError(
                `${Object.values(err.errors)
                  .map((error) => error.massage)
                  .join(', ')}`,
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError(`Пользователь с id: ${req.user._id} не найден.`)))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан неверный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => next(new NotFoundError(`Пользователь с id: ${req.user._id} не найден.`)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для обновления информации о пользователе',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      if (!token) {
        next(new UnauthorizedError('Ошибка при создании токена'));
      }
      return res
        .cookie('jwt', token, {
          domain: 'filmexplorer.students.nomoredomains.sbs',
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
          // secure: true,
        })
        .status(200)
        .send({ message: 'Успешный вход' });
    })
    .catch(() => next(new UnauthorizedError('Ошибка аутентификации')));
};

module.exports.logoutUser = (req, res, next) => {
  res
    .clearCookie('jwt')
    .status(200)
    .send({ message: 'Вы вышли из системы' })
    .catch(() => next(new UnauthorizedError('Ошибка аутентификации')));
};
