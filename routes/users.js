const userRouter = require('express').Router();
const { celebrate, errors } = require('celebrate');
const {
  userIdValidator,
  updateUserValidator,
  updateUserAvatarValidator,
} = require('../middlewares/dataValidation');
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.get('/me', getMe);
userRouter.get('/:userId', celebrate(userIdValidator), getUserById);
userRouter.patch('/me', celebrate(updateUserValidator), updateUserProfile);
userRouter.patch(
  '/me/avatar',
  celebrate(updateUserAvatarValidator),
  updateUserAvatar,
);
errors();
module.exports = userRouter;
