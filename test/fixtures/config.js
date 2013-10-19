'use strict';
var fixtures = require('pow-mongoose-fixtures'),
    app = require('models'),
    data = require('./data'),
    done = false,
    mongoose = app.mongoose,
    callback;

exports.app = app;

fixtures.load(data, mongoose.connection, function () {
  exports.events = data.events;
  done = true;
  if (callback) {
    return callback();
  }
});

exports.events = data.events;
exports.users = data.users;

exports.ready = function (cb) {
  callback = cb;
  if (done) {
    callback();
  }
};