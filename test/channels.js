'use strict';
var should = require('should');
var channels = require('channels');

describe('channels', function () {
  it('should create channel for events', function () {
    var channel = channels.events('new event');
    should.exist(channel);
  });
  it('should wake sub on pub', function (done) {
    var test = 'test',
        data = {hello:'world'},
        subName = 'events:subscribe';
    var channel = channels.events(test);

    channel.subscribe(subName, function (d) {
      d.should.eql(data);
      done();
    });
    channel.publish(subName, data);
  });
});