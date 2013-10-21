'use strict';
var mubsub = require('mubsub');

var client = mubsub('');
var eventsPrefix = '/events/';

exports.events = function (name) {
  var channel = client.channel(eventsPrefix + name);
  return channel;
};

client.on('error', console.error);
