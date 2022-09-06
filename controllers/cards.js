const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для создания карточки',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      }
      return card.remove();
    })
    .then(() => {
      Card.find({}).then((card) => res.send(card));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
  .then((card) => {
    res.send(card);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
  .then((card) => {
    res.send(card);
  })
  .catch(next);
