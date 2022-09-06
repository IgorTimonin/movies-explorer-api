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
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(({ _id }) => res.send({
          name,
          about,
          avatar,
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

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ users: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
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
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
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

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => next(new NotFoundError('Пользователь не найден.')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для обновления аватара',
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
        NODE_ENV === 'development' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      if (!token) {
        next(new UnauthorizedError('Ошибка при создании токена'));
      }
      return res
        .cookie('jwt', token, {
          domain: 'itmesto.students.nomoredomains.sbs',
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .send({ message: 'Успешный вход' });
    })
    .catch(() => next(new UnauthorizedError('Ошибка аутентификации')));
};
