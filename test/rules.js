'use strict';
require('should');
var robot = require('robots').get('robot');
var reload = require('./fixtures/config').reload;
var config = require('robots/config');
var models = require('models'),
    Guest = models.Guest,
    Message = models.Message;

describe('robot of event', function () {
  var info, session;

  before(function () {
    reload();
    session = {};
  });

  function infoInit() {
    info = new robot.Info();
    info.session = session;
  }

  beforeEach(infoInit);

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
      Guest.find({id: info.uid}, function (err, docs) {
        docs.should.have.lengthOf(1);
        done();
      });
    });
  });
  describe('in chat', function () {
    beforeEach(infoInit);
    it('should return ack on chat', function (done) {
      info.text = 'hello';
      reply(info, function (err, info) {
        info.reply.should.equal(config.ackMsg);
        Message.find(function (err, docs) {
          docs.should.have.lengthOf(1);
          done();
        });
      });
    });
    it('should continue chating', function (done) {
      info.text = 'hello2';
      reply(info, function (err, info) {
        info.reply.should.equal(config.ackMsg);
        Message.find(function (err, docs) {
          docs.should.have.lengthOf(2);
          done();
        });
      });
    });
    it('should return goodbye on exit', function (done) {
      info.text = 'exit';
      reply(info, function (err, info) {
        info.reply.should.equal(config.goodbyeMsg);
        done();
      });
    });
  });
});
