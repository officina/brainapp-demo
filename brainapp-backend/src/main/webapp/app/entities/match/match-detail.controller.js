(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .controller('MatchDetailController', MatchDetailController);

    MatchDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Match', 'Game', 'MatchTemplate', 'Attempt', 'Session'];

    function MatchDetailController($scope, $rootScope, $stateParams, previousState, entity, Match, Game, MatchTemplate, Attempt, Session) {
        var vm = this;

        vm.match = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('brainappbackendApp:matchUpdate', function(event, result) {
            vm.match = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
