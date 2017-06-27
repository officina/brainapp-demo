'use strict';

describe('Controller Tests', function() {

    describe('Match Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockMatch, MockGame, MockMatchTemplate, MockAttempt;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockMatch = jasmine.createSpy('MockMatch');
            MockGame = jasmine.createSpy('MockGame');
            MockMatchTemplate = jasmine.createSpy('MockMatchTemplate');
            MockAttempt = jasmine.createSpy('MockAttempt');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'Match': MockMatch,
                'Game': MockGame,
                'MatchTemplate': MockMatchTemplate,
                'Attempt': MockAttempt
            };
            createController = function() {
                $injector.get('$controller')("MatchDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'gatoradeApp:matchUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
