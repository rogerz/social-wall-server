'use strict';
var mubsub = require('mubsub');

var dbUri = 'mongodb://localhost:27017/social_wall_channels';
var client = mubsub(dbUri);
var eventsPrefix = '/events/';

exports.events = function (name) {
  var channel = client.channel(eventsPrefix + name);
  return channel;
};

client.on('error', console.error);
