'use strict';
/*
 * Serve content over a socket
 */
var socket = require('socket.io');
var channels = require('channels');

function connected(socket) {
  socket.emit('socket:ident', {
    name: 'social-wall'
  });

  setInterval(function () {
    socket.emit('socket:heartbeat', {
      time: (new Date()).toString()
    });
  }, 1000);

  socket.on('events/connect', function (name) {
    channels.events(name).subscribe('enter', function (guest) {
      socket.emit('enter', guest);
    });
/*
    channels.events(name).subscribe('leave', function (guest) {
      socket.emit('leave', guest);
    });
*/
  });
}

// register socket.io on http server
exports.register = function register(server) {
  var io = socket.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', connected);
};
