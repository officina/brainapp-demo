'use strict';

describe('Directive: gamebox', function () {

  // load the directive's module
  beforeEach(module('gatoradeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gamebox></gamebox>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the gamebox directive');
  }));
});
