'use strict';
/**
 * Module dependencies
 */
var express = require('express');
var app = module.exports = express();

/**
 * Configuration
 */

var config = require('./lib/config');

// all environments
app.set('port', config.port);

app.use(config.api + '/restful', require('./lib/restful').app);
app.use(config.api + '/robots', require('./lib/robots'));
app.use(app.router);

app.configure('development', function () {
  app.use(express['static']('site/app'));
  app.use(express['static']('site/.tmp'));
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

app.configure('production', function () {
  app.use(express['static']('site/dist'));
});

// Enable socket.io
var io = require('./lib/socket');
var server = app.server = require('http').Server(app);
io.attach(server, {
  'log level': 1,
  'resource': config.api + '/socket.io'
});

/**
 * Start Server
 */
if (!module.parent) {
  server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}
