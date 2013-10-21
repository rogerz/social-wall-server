'use strict';
require('should');
var robot = require('../lib/robots').get('robot');
var reload = require('./fixtures/config').reload;
var config = require('../lib/robots/config');
var models = require('../lib/models'),
    channels = require('../lib/channels'),
    Guest = models.Guest,
    Message = models.Message;
var debug = require('debug'),
    verbose = debug('test:rules');

describe('robot of event', function () {
  var info, session, subscription;

  before(function () {
    reload();
    session = {};
  });

  function infoInit() {
    info = new robot.Info();
    info.uid = 'client';
    info.sid = 'server';
    info.session = session;
  }

  beforeEach(infoInit);
  afterEach(function () {
    if (subscription) {
      subscription.unsubscribe();
    }
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
    subscription = channels.events(config.eventName).subscribe('enter', function (guest) {
      guest.id.should.equal(info.uid);
      done();
    });
    reply(info, function (err, info) {
      info.reply.should.equal(config.helpMsg);
      Guest.find({id: info.uid}, function (err, docs) {
        docs.should.have.lengthOf(1);
      });
    });
  });
  it('should return ack on chat', function (done) {
    info.text = 'hello';
    subscription = channels.events(info.session.event).subscribe('chat', function (message) {
      message.guestId.should.equal(info.uid);
      message.content.text.should.equal(info.text);
      verbose('receive chat', message);
      done();
    });
    reply(info, function (err, info) {
      info.reply.should.equal(config.ackMsg);
      Message.find(function (err, docs) {
        docs.should.have.lengthOf(1);
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
    subscription = channels.events(info.session.event).subscribe('leave', function (guestId) {
      guestId.should.equal(info.uid);
      done();
    });
    reply(info, function (err, info) {
      info.reply.should.equal(config.goodbyeMsg);
    });
  });
});
