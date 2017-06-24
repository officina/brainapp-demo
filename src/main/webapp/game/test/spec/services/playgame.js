'use strict';

describe('Service: playgame', function () {

  // load the service's module
  beforeEach(module('desktopApp'));

  // instantiate service
  var playgame;
  beforeEach(inject(function (_playgame_) {
    playgame = _playgame_;
  }));

  it('should do something', function () {
    expect(!!playgame).toBe(true);
  });

});
