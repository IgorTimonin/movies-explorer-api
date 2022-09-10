const limiter = require('express-limiter');

module.exports = () => {
  limiter({
    path: '*',
    method: 'all',
    lookup: 'connection.remoteAddress',
    total: 100,
    expire: 3600000 * 24,
  });
};
