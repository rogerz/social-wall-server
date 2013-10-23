'use strict';
/**
 * Module dependencies
 */
var express = require('express');
var app = module.exports = express();

/**
 * Configuration
 */

var config = require('./config.js');

// all environments
app.set('port', config.port);

app.use('/api/models', require('./lib/models').app);
app.use('/api/robots', require('./lib/robots'));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express['static']('site/app'));
  app.use(express['static']('site/.tmp'));
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  app.use(express['static']('site/dist'));
}

// Enable socket.io
var io = require('./lib/socket');
var server = app.server = require('http').Server(app);
io.register(server);

/**
 * Start Server
 */
if (!module.parent) {
  server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}
