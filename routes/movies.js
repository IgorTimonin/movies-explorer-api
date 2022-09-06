const cardRouter = require('express').Router();
const { celebrate, errors } = require('celebrate');
const {
  cardIdValidator,
  createCardValidator,
} = require('../middlewares/dataValidation');
const {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.post('/', celebrate(createCardValidator), createCard);
cardRouter.get('/', getCard);
cardRouter.delete('/:cardId', celebrate(cardIdValidator), deleteCard);
cardRouter.put('/:cardId/likes', celebrate(cardIdValidator), likeCard);
cardRouter.delete('/:cardId/likes', celebrate(cardIdValidator), dislikeCard);
errors();
module.exports = cardRouter;
