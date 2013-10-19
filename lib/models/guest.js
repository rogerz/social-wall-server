'use strict';

var restful = require('node-restful'),
    mongoose = restful.mongoose;

exports = module.exports = restful.model(
  'Guest',
  new mongoose.Schema({
    id: {type: String, unique: true},
    name: String,
    portrait: String
  })
).methods(['get', 'post', 'put', 'delete']);