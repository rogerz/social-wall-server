'use strict';

var config = require('robots/config');
var m = require('models');

exports = module.exports = function (webot) {
  webot.set('exit', {
    description: 'leave event',
    pattern: /^exit$/i,
    handler: function (info, next) {
      m.Guest.findOneAndRemove({id: info.uid}, function (err) {
        if (err) {
          return next(null, config.errorMsg);
        } else {
          return next(null, config.goodbyeMsg);
        }
      });
    }
  });
  webot.set('nickname', {
    description: 'change nickname',
    pattern: /^nickname$/i,
    handler: function (info) {
      info.wait('change nick');
      return config.nicknameMsg;
    }
  });
  webot.waitRule('change nick', function (info, next) {
    var nickname = info.text;
    if (nickname === undefined) {
      info.rewait();
      return next(null, config.nicknameMsg);
    }
    m.Guest.findOneAndUpdate({id: info.uid}, {nickname: nickname}, function (err) {
      if (err) {
        return next(null, config.errorMsg);
      } else {
        return next(null, config.ackMsg);
      }
    });
    return null;
  });
  webot.set('help', config.helpMsg);

  webot.set('/.*/', function (info, next) {
    m.Message.create(
      {guestId: info.uid, content: {text: info.text}},
      function (err) {
        if (err) {
          return next(null, config.errorMsg);
        } else {
          return next(null, config.ackMsg);
        }
      });
  });
};