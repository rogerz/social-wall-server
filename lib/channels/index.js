'use strict';
var config = require('../models/config');
var mubsub = require('mubsub');

var client = mubsub(config.db);
var eventsPrefix = '/events/';

exports.events = function (name) {
  var channel = client.channel(eventsPrefix + name);
  return channel;
};

client.on('error', console.error);
