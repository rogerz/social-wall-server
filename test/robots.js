'use strict';
var request = require('supertest'),
    app = require('..');

describe('robots', function () {
  it('should reject unauthorized access', function () {
    request(app)
    .get('/robots/wechat')
    .expect(401);
  });
});