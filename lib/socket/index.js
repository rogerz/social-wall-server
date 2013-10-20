'use strict';
/*
 * Serve content over a socket
 */
var socket = require('socket.io');
var channels = require('channels');

var debug = require('debug'),
    log = debug('socket:log');

function connected(socket) {
  socket.emit('socket:ident', {
    name: 'social-wall'
  });

  setInterval(function () {
    socket.emit('socket:heartbeat', {
      time: (new Date()).toString()
    });
  }, 1000);

  socket.on('events:subscribe', function (name) {
    log('subscribed');
    var eventSubs = socket.eventSubs || (socket.eventSubs = {});
    var subs = eventSubs[name] || (eventSubs[name] = []);
    var channel = channels.events(name);
    subs.concat([
      channel.subscribe('enter', function (guest) {
        log('relaying enter', guest);
        socket.emit('enter', guest);
      }),
      channel.subscribe('leave', function (guestId) {
        socket.emit('leave', guestId);
      }),
      channel.subscribe('chat', function (message) {
        socket.emit('chat', message);
      })
    ]);
  });
  socket.on('events:unsubscribe', function (name) {
    socket.eventSubs[name].forEach(function (sub) {
      sub.unsubscribe();
    });
  });

  socket.on('socket:ping', function (ping) {
    socket.emit('socket:pong', ping);
  });

  socket.on('disconnect', function () {
    function unsub(sub) {
      sub.unsubscribe();
    }
    for (var name in socket.eventSubs) {
      socket.eventSubs[name].forEach(unsub);
    }
  });
}

// register socket.io on http server
exports.register = function register(server) {
  var io = socket.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', connected);
};
