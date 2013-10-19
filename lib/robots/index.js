'use strict';
var express = require('express');
var webot = require('weixin-robot');
var config = require('./config');

var app = module.exports = express();
app.set('robot', webot);

app.set('port', process.env.PORT || 3000);
app.use(express.cookieParser());
// waitRule requires session
// TODO: use permanent store for session, see http://expressjs.com/2x/guide.html#session-support
app.use(express.session({ secret: 'sdfie7Dfj', store: new express.session.MemoryStore() }));

webot.loads('./rules');
webot.watch(app, {token: config.token, path: config.path});

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

/**
 * Start Server
 */
if (!module.parent) {
  app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}