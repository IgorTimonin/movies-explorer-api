const { Joi } = require('celebrate');
const { linkRegExPattern } = require('../utils/constants');

module.exports.loginUserValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports.createUserValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
};

module.exports.updateUserValidator = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
};

module.exports.createMovieValidator = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    trailer: Joi.string().required().pattern(linkRegExPattern),
    image: Joi.string().required().pattern(linkRegExPattern),
    thumbnail: Joi.string().required().pattern(linkRegExPattern),
  }),
};

module.exports.movieIdValidator = {
  params: Joi.object().keys({
    Id: Joi.string()
      .required()
      .min(24)
      .max(24)
      .pattern(/^[a-f\d]{24}$/i),
  }),
};
