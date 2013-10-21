'use strict';

var debug = require('debug');
// debug message level
var log = debug('webot:log');
// var verbose = debug('webot:verbose');
// var error = debug('webot:error');

var config = require('../../robots/config');
var m = require('../../models');
var channels = require('../../channels');

function exact(str) {
  return new RegExp('^' + str + '$');
}

module.exports = exports = function (webot){
  // enter event
  webot.set('enter', {
    description: 'type event name to enter',
    pattern: exact(config.eventName),
    handler: function (info, next) {
      m.Guest.find({id: info.uid}).exec(function (err, docs) {
        if (err) {
          return next(null, config.errorMsg);
        } else if (docs.length === 0) {
          // TODO: retrieve user nickname and portrait from uid
          info.wait('register');
          return next(null, config.welcomeMsg + config.nicknameMsg);
        } else {
          info.wait('chat');
          return next(null, config.helpMsg);
        }
      });
    }
  });

  // register nickname
  webot.waitRule('register', function (info, next) {
    var nickname = info.text;
    if (nickname === undefined) {
      info.rewait();
      return next(null, config.nicknameMsg);
    }
    var guest = {id: info.uid, nickname: nickname};
    m.Guest.create(guest, function (err) {
      if (err) {
        return next(null, config.errorMsg);
      }
      info.wait('chat');
      channels.events(config.eventName).publish('enter', guest);
      return next(null, config.helpMsg);
    });
    return null;
  });

  webot.loads('./chat');

  // unhandled message
  webot.set(/.*/, function (info) {
    log('unhandled message: %s', info.text);
    info.flag = true;
    return 'I don\'t understand "' + info.text + '"';
  });
};
