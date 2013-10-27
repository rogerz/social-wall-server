'use strict';

require('../../lib/models');

var fixtures = require('pow-mongoose-fixtures'),
    app = require('../../lib/restful').app,
    data = require('./data'),
    done = false,
    mongoose = app.mongoose,
    callback;

exports.app = app;

exports.reload = function () {
  fixtures.load(data, mongoose.connection, function () {
    exports.events = data.events;
    done = true;
    if (callback) {
      return callback();
    }
  });
};

exports.events = data.events;
exports.users = data.users;

exports.ready = function (cb) {
  callback = cb;
  if (done) {
    callback();
  }
};
