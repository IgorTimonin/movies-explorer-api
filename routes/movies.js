const movieRouter = require('express').Router();
const { celebrate, errors } = require('celebrate');
const {
  movieIdValidator,
  createMovieValidator,
} = require('../middlewares/dataValidation');
const {
  createMovie,
  getMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovie);
movieRouter.post('/', celebrate(createMovieValidator), createMovie);
movieRouter.delete('/:_Id', celebrate(movieIdValidator), deleteMovie);
errors();
module.exports = movieRouter;
