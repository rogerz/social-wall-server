'use strict';

var db;

try {
  db = process.env.VCAP_SERVICES['mongolab-dev-n/a'].credentials.uri;
} catch (e) {
  db = 'mongodb://localhost/social-wall';
}

module.exports = {
  db: db
};