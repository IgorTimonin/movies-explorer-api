const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { emailOrPassErr } = require('../errors/errorsConsts');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [
        2,
        'Имя должно быть длиннее 2-х символов, сейчас его длина {VALUE} символ(ов)',
      ],
      maxlength: [
        30,
        'Имя должно быть короче 30 символов, сейчас его длина {VALUE} символ(ов)',
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validation: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.statics.findUserByCredentials = function userValidation(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(emailOrPassErr));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError(emailOrPassErr));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
