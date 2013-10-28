'use strict';

exports = module.exports = {
  port: 3000,
  api: '/api',
  db: 'mongodb://localhost/socialwall',
  cookieSecret: 'dfiu3i4EW43',
  sessionSecret: 'efiou5$dfdsf'
};

// args > env.PORT > default
if (process.argv[2]) {
  exports.port = parseInt(process.argv[2], 10);
} else {
  exports.port = process.env.PORT || exports.port;
}