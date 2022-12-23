require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser, logoutUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { rateLimiter } = require('./middlewares/limiter');

const { NODE_ENV, DB_PATH, PORT = 3001 } = process.env;
const app = express();

const {
  loginUserValidator,
  createUserValidator,
} = require('./middlewares/dataValidation');
const NotFoundError = require('./errors/NotFoundError');
const { mongoAdress } = require('./configs');
const { errorHandler } = require('./middlewares/errorHandler');
const { pageNotFoundErr } = require('./errors/errorsConsts');
const { userRouter, movieRouter } = require('./routes');

mongoose.connect(NODE_ENV === 'production' ? DB_PATH : mongoAdress, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
app.use(requestLogger); // логгер запросов
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://filmexplorer.students.nomoredomains.sbs',
    'http://filmexplorer.students.nomoredomains.sbs',
    'https://movieyes-ten.vercel.app/',
    'http://movieyes-ten.vercel.app/',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());

app.post('/signin', celebrate(loginUserValidator), login);
app.post('/signup', celebrate(createUserValidator), createUser);
app.get('/signout', auth, logoutUser);

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);
app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError(pageNotFoundErr));
});
app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок
app.listen(PORT);
