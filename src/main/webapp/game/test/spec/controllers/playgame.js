'use strict';

describe('Controller: PlaygameCtrl', function () {

  // load the controller's module
  beforeEach(module('desktopApp'));

  var PlaygameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaygameCtrl = $controller('PlaygameCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlaygameCtrl.awesomeThings.length).toBe(3);
  });
});
