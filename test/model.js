'use strict';

var request = require('supertest'),
    config = require('./fixtures/config'),
    app = config.app,
    path = '/models/';

describe('models', function () {
  it('should provide resources', function () {
    var resources = ['events', 'guests', 'messages'];
    for (var res = 0; res < resources.length; res++) {
      request(app)
      .get(path + res)
      .expect('Content-Type', /json/)
      .expect(200);
    }
  });
});
