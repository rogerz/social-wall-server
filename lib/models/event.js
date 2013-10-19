'use strict';

var restful = require('node-restful'),
    mongoose = restful.mongoose;

exports = module.exports = restful.model('Event', new mongoose.Schema({
  name: {type: String, unique: true}
}));