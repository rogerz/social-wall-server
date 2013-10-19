'use strict';

var restful = require('node-restful'),
    mongoose = restful.mongoose;

exports = module.exports = restful.model(
  'Message',
  new mongoose.Schema({
    guestId: String,
    content: {
      text: String,
      image: String
    },
    date: {type: Date, default: Date.now}
  })
).methods(['get', 'post', 'put', 'delete']);