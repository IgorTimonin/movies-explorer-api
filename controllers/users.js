require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUND, domainAdress } = require('../configs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const {
  createTokenErr,
  successLogout,
  successLogin,
  reqUserDataErr,
  userNotFoundErr,
  invalidUserIdErr,
  conflictEmailErr,
} = require('../errors/errorsConsts');

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
            next(new ConflictError(conflictEmailErr));
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
    .orFail(() => new NotFoundError(userNotFoundErr))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(invalidUserIdErr));
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(conflictEmailErr));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(reqUserDataErr));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      if (!token) {
        next(new UnauthorizedError(createTokenErr));
      }
      return res
        .cookie('jwt', token, {
          domain: domainAdress,
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .send({ message: successLogin });
    })
    .catch(next);
};

module.exports.logoutUser = (req, res) => {
  res
    .clearCookie('jwt', {
      domain: domainAdress,
      httpOnly: true,
      sameSite: true,
    })
    .status(200)
    .send({ message: successLogout });
};
