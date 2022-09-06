const userRouter = require('express').Router();
const { celebrate, errors } = require('celebrate');
const {
  updateUserValidator,
} = require('../middlewares/dataValidation');
const {
  updateUserProfile,
  getMe,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.patch('/me', celebrate(updateUserValidator), updateUserProfile);

errors();
module.exports = userRouter;
