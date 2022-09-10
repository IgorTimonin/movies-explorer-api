const movieRouter = require('express').Router();
const { celebrate, errors } = require('celebrate');
const {
  movieIdValidator,
  createMovieValidator,
} = require('../middlewares/dataValidation');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', celebrate(createMovieValidator), createMovie);
movieRouter.delete('/:Id', celebrate(movieIdValidator), deleteMovie);
errors();
module.exports = movieRouter;
