'use strict';
var should = require('should');
var config = require('../config');
var app = require('..');

var bootstrap = require('./bootstrap.js');
var makeRequest = bootstrap.makeRequest;
var sendRequest = makeRequest('http://localhost:' + app.get('port') + config.path, config.token);

/* global describe: false */
/* global beforeEach: false */
/* global it: false */

var detect = function(info, err, json, content){
  should.exist(info);
  should.not.exist(err);
  should.exist(json);
  json.should.have.type('object');
  if(content){
    json.should.have.property('Content');
    json.Content.should.match(content);
  }
};

var exact = function(str) {
  return new RegExp('^' + str + '$');
};

app.listen(app.get('port'));

describe('rules', function(){
  var info = null;
  beforeEach(function(){
    info = {
      sp: 'webot',
      user: 'client',
      type: 'text'
    };
  });

  describe('event', function(){
    it('should reply welcome messsage when receive event name', function(done){
      info.text = config.eventName;
      sendRequest(info, function(err, json){
        detect(info, err, json, exact(config.welcomeMsg));
        done();
      });
    });
    it('should ack message during event', function (done) {
      info.text = 'Hello';
      sendRequest(info, function (err, json) {
        detect(info, err, json, exact(config.ackMsg));
        done();
      });
    });
    it('should reply goodbye when receive "exit"', function (done) {
      info.text = 'exit';
      sendRequest(info, function (err, json) {
        detect(info, err, json, exact(config.goodbyeMsg));
        done();
      });
    });
  });

  describe('fallback', function(){
    it('should add funcflag', function(done){
      info.type = 'text';
      info.text = '乱麻乱麻乱麻';
      sendRequest(info, function(err, json){
        detect(info, err, json);
        json.should.have.property('FuncFlag', 1);
        done();
      });
    });
  });
});
