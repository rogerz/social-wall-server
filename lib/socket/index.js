'use strict';
/*
 * Serve content over a socket
 */
var socket = require('socket.io');

function connected(socket) {
  socket.emit('socket:ident', {
    name: 'social-wall'
  });

  setInterval(function () {
    socket.emit('socket:heartbeat', {
      time: (new Date()).toString()
    });
  }, 1000);
}

exports.register = function register(server) {
  var io = socket.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', connected);
};
