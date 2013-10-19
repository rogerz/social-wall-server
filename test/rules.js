'use strict';
require('should');
var robot = require('robots').get('robot');
var reload = require('./fixtures/config').reload;
var config = require('robots/config');

describe('robot of event', function () {
  var info, session;

  before(function () {
    reload();
    session = {};
  });

  beforeEach(function () {
    info = new robot.Info();
    info.session = session;
  });

  function reply(info, fn) {
    if (typeof info === 'string') {
      info = {text: info};
    }
    robot.reply(info, fn);
  }

  it('should welcome guest', function (done) {
    info.text = config.eventName;
    reply(info, function (err, info) {
      info.reply.should.equal(config.welcomeMsg + config.nicknameMsg);
      done();
    });
  });
  it('should accept nickname', function (done) {
    info.text = 'nick';
    reply(info, function (err, info) {
      info.reply.should.equal(config.helpMsg);
      done();
    });
  });
  describe('in chat', function () {
    it('should return ack on chat', function (done) {
      reply('hello', function (err, info) {
        info.reply.should.equal(config.ackMsg);
        done();
      });
    });
    it('should return goodbye on exit', function (done) {
      reply('exit', function (err, info) {
        info.reply.should.equal(config.goodbyeMsg);
        done();
      });
    });
  });
});
