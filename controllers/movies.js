const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const { cantDeleteOtherMovieErr, movieNotFoundErr, reqMovieDataErr } = require('../errors/errorsConsts');

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(reqMovieDataErr));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.Id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFoundErr);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(cantDeleteOtherMovieErr);
      }
      return movie.remove();
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};
