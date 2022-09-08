const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { celebrate, errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('express-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser, logoutUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3001 } = process.env;
const app = express();
const movieRouter = require('./routes/movies');
const userRouter = require('./routes/users');
const {
  loginUserValidator,
  createUserValidator,
} = require('./middlewares/dataValidation');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // логгер запросов

const corsOptions = {
  origin: /https?:\/\/filmexplorer.students.nomoredomains.sbs/,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());

limiter({
  path: '*',
  method: 'all',
  lookup: 'connection.remoteAddress',
  total: 120,
  expire: 3600000 * 24,
});

app.post('/signin', celebrate(loginUserValidator), login);
app.post('/signup', celebrate(createUserValidator), createUser);
app.get('/signout', logoutUser);

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);
app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Упс! Такой страницы не существует'));
});
app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});
app.listen(PORT);
