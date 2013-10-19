'use strict';

var debug = require('debug');
// debug message level
var log = debug('webot-example:log');
var verbose = debug('webot-example:verbose');
// var error = debug('webot-example:error');

var config = require('../config');

function exact(str) {
  return new RegExp('^' + str + '$');
}

module.exports = exports = function (webot){

  // enter chat mode
  webot.set({
    name: 'event enter',
    description: 'Type event name to enter',
    pattern: exact(config.eventName),
    handler: function () {
      verbose('Entering event');
      return config.welcomeMsg;
    },
    replies: {
      '/^exit|quit|退出$/i': config.goodbyeMsg,
      '/.*/': function post(info) {
        verbose(info.rewaitCount +': '+ info.text);
        info.rewait();
        return config.ackMsg;
      }
    }
  });

  // unhandled message
  webot.set(/.*/, function (info) {
    log('unhandled message: %s', info.text);
    info.flag = true;
    return 'I don\'t understand "' + info.text + '"';
  });
};
