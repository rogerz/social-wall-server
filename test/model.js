var should = require('should'),
    request = require('supertest'),
    config = require('./fixtures/config'),
    app = config.app;

describe('handlers', function () {
  it('should handle models request', function () {
    request(app)
    .get('/models/events')
    .expect('Content-Type', /json/)
    .expect(200);
  });
});
