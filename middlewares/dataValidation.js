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
    name: Joi.string().min(2).max(30),
  }),
};

module.exports.updateUserValidator = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
};

module.exports.createMovieValidator = {
  body: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    description: Joi.string(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    movieId: Joi.string(),
    duration: Joi.number(),
    year: Joi.number(),
    trailer: Joi.string().required().pattern(linkRegExPattern),
    image: Joi.string().required().pattern(linkRegExPattern),
    thumbnail: Joi.string().required().pattern(linkRegExPattern),
    owner: Joi.string(),
  }),
};

module.exports.userIdValidator = {
  params: Joi.object().keys({
    userId: Joi.string()
      .required()
      .min(24)
      .max(24)
      .pattern(/^[a-f\d]{24}$/i),
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
