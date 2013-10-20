'use strict';

var config = require('robots/config');
var m = require('models');

exports = module.exports = function (webot) {
  function exitFn(info, next) {
    m.Guest.findOneAndRemove({id: info.uid}, function (err) {
      if (err) {
        return next(null, config.errorMsg);
      } else {
        return next(null, config.goodbyeMsg);
      }
    });
  }

  function helpFn(info) {
    info.rewait();
    return config.helpMsg;
  }

  function chatFn(info, next) {
    info.rewait();
    m.Message.create(
      {guestId: info.uid, content: {text: info.text}},
      function (err) {
        if (err) {
          return next(null, config.errorMsg);
        } else {
          return next(null, config.ackMsg);
        }
      });
  }

  webot.waitRule('chat', function (info, next) {
    if (/^exit$/.test(info.text)) {
      return exitFn(info, next);
    } else if (/^help$/.test(info.text)) {
      return helpFn(info, next);
    } else {
      return chatFn(info, next);
    }
  });
  /*
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
   */
};