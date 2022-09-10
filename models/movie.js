const mongoose = require('mongoose');
const { linkRegExPattern } = require('../utils/constants');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
      validate: linkRegExPattern,
    },
    image: {
      type: String,
      required: true,
      validate: linkRegExPattern,
    },
    thumbnail: {
      type: String,
      required: true,
      validate: linkRegExPattern,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
  },
);
module.exports = mongoose.model('movie', movieSchema);
