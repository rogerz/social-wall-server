'use strict';

var db =  process.env.DBURI ||'mongodb://localhost/social-wall';

module.exports = {
  db: db
};