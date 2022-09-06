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
} = require('../controllers/cards');

cardRouter.post('/', celebrate(createCardValidator), createCard);
cardRouter.get('/', getCard);
cardRouter.delete('/_Id', celebrate(cardIdValidator), deleteCard);
errors();
module.exports = cardRouter;
