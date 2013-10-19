'use strict';
/*
 * Serve content over a socket
 */
var socket = require('socket.io');
var http = require('http');

function connected(socket) {
  socket.emit('send:name', {
    name: 'Bob'
  });

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
}

exports.register = function register(app) {
  var server = http.Server(app);
  var io = socket.listen(server);
  io.sockets.on('connection', connected);
};
