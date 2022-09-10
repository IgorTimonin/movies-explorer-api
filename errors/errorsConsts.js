const emailOrPassErr = 'Неправильные почта или пароль';
const createTokenErr = 'Ошибка при создании токена';
const reqUserDataErr = 'Переданы некорректные данные для обновления информации о пользователе';
const userNotFoundErr = 'Пользователь c таким id не найден';
const invalidUserIdErr = 'Передан неверный id пользователя';
const conflictEmailErr = 'Пользователь c таким email уже существует';
const cantDeleteOtherMovieErr = 'Вы не можете удалять чужие фильмы';
const movieNotFoundErr = 'Запрашиваемый фильм не найден';
const reqMovieDataErr = 'Переданы некорректные данные для добавления фильма';
const pageNotFoundErr = 'Упс! Такой страницы не существует';

const successLogin = 'Успешный вход';
const successLogout = 'Вы вышли из системы';

module.exports = {
  emailOrPassErr,
  createTokenErr,
  successLogin,
  successLogout,
  reqUserDataErr,
  userNotFoundErr,
  invalidUserIdErr,
  conflictEmailErr,
  cantDeleteOtherMovieErr,
  movieNotFoundErr,
  reqMovieDataErr,
  pageNotFoundErr,
};
