'use strict';

var express = require('express'),
    config = require('./config'),
    app = module.exports = express();

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

var mongoose = app.mongoose = require('node-restful').mongoose;
mongoose.connect(config.db);

// load models before connection
var Event = require('./event'),
    Guest = require('./guest'),
    Message = require('./message');

// restful API
mongoose.connection.on('connected', function () {
  Guest.register(app, '/guests');
  Event.register(app, '/events');
  Message.register(app, '/messages');
});

if (!module.parent) {
  app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}
