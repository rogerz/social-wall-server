'use strict';
require('should');

var request = require('supertest');
var ioc = require('socket.io-client');

var server = require('..').server;
var config = require('../lib/config');

function client(server, namespace, options) {
  if ('object' === typeof namespace) {
    options = namespace;
    namespace = null;
  }
  var address = server.address();
  if (!address) {
    address = server.listen().address();
  }
  var url = 'http://' + address.address + ':' + address.port + (namespace || '');
  return ioc.connect(url, options);
}

describe('socket', function () {
  var options = {resource: config.api.slice(1) + '/socket.io'};
  it('should serve client socket', function (done) {
    request(server)
    .get(config.api + '/socket.io/socket.io.js')
    .expect(200, done);
  });
  it('should emit ident', function (done) {
    server.listen(function () {
      var socket = client(server, options);
      socket.on('socket:ident', function (a) {
        a.should.eql({name: 'social-wall'});
        done();
      });
    });
  });
  it('should emit heartbeat', function (done) {
    server.listen(function () {
      var socket = client(server, options);
      socket.on('socket:heartbeat', function(a) {
        a.should.have.property('time');
        done();
      });
    });
  });
  it('should reply ping', function (done) {
    server.listen(function () {
      var ping = 'data';
      var socket = client(server, options);
      socket.emit('socket:ping', ping);
      socket.on('socket:pong', function (pong) {
        pong.should.eql(ping);
        done();
      });
    });
  });
  it('should subscribe guest activity', function (done) {
    var channels = require('../lib/channels');
    var eventName = require('../lib/robots/config').eventName;
    var channel = channels.events(eventName);

    server.listen(function () {
      var socket = client(server, options);
      var guest = {id: 12323, nickname: 'nick'};
      socket.emit('events:subscribe', eventName);
      channel.publish('enter', guest);
      socket.on('enter', function (data) {
        data.should.eql(guest);
        done();
      });
    });
  });
});
