const movieRouter = require('express').Router();
const userRouter = require('express').Router();
const { celebrate, errors } = require('celebrate');
const {
  movieIdValidator,
  createMovieValidator,
  updateUserValidator,
} = require('../middlewares/dataValidation');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');
const { updateUserProfile, getMe } = require('../controllers/users');

movieRouter.get('/', getMovies);
movieRouter.post('/', celebrate(createMovieValidator), createMovie);
movieRouter.delete('/:Id', celebrate(movieIdValidator), deleteMovie);

userRouter.get('/me', getMe);
userRouter.patch('/me', celebrate(updateUserValidator), updateUserProfile);

errors();
module.exports = { movieRouter, userRouter };
