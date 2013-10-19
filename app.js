'use strict';
/**
 * Module dependencies
 */
var express = require('express');
var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);

app.use('/models', require('models'));
app.use('/robots', require('robots'));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
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
