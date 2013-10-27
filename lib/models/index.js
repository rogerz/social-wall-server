'use strict';

var path = require('path');
var glob = require('glob');

glob.sync(path.resolve(__dirname,'*.js')).forEach( function (file) {
  var name = path.basename(file, '.js');
  if (name === 'index' || name === 'config') {
    return;
  }

  var model = require('./' + name);

  module.exports[model.modelName] = model;
});
