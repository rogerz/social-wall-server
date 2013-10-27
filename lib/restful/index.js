'use strict';

var express = require('express'),
    config = require('../config'),
    app = exports.app = express();

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

var models = require('../models');
var pluralize = require('pluralize');

// restful API
mongoose.connection.on('connected', function () {
  for (var modelName in models) {
    models[modelName].register(app, '/' + pluralize(modelName.toLowerCase()));
  }
});

if (module === require.main) {
  app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}
