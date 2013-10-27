'use strict';

var request = require('supertest'),
    app = require('..');
var config = require('../config');
var path = config.api + '/restful/';
var async = require('async');

describe('restful', function () {
  it('should provide resources', function (done) {
    var resources = ['events', 'guests', 'messages'];
    var iter = function (res, fn) {
      request(app)
      .get(path + res)
      .expect('Content-Type', /json/)
      .expect(200, fn);
    };
    async.each(resources, iter, done);
  });
});
