'use strict';
require('should');

var request = require('supertest');
var ioc = require('socket.io-client');

var server = require('..').server;

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
  it('should serve client socket', function (done) {
    request(server)
    .get('/socket.io/socket.io.js')
    .expect(200, done);
  });
  it('should emit ident', function (done) {
    server.listen(function () {
      var socket = client(server);
      socket.on('socket:ident', function (a) {
        a.should.eql({name: 'social-wall'});
        done();
      });
    });
  });
  it('should emit heartbeat', function (done) {
    server.listen(function () {
      var socket = client(server);
      socket.on('socket:heartbeat', function(a) {
        a.should.have.property('time');
        done();
      });
    });
  });
  it('should reply ping', function (done) {
    server.listen(function () {
      var ping = 'data';
      var socket = client(server);
      socket.emit('socket:ping', ping);
      socket.on('socket:pong', function (pong) {
        pong.should.eql(ping);
        done();
      });
    });
  });
});
