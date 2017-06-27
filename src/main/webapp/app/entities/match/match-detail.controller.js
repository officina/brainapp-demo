(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('MatchDetailController', MatchDetailController);

    MatchDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Match', 'Game', 'MatchTemplate', 'Attempt'];

    function MatchDetailController($scope, $rootScope, $stateParams, previousState, entity, Match, Game, MatchTemplate, Attempt) {
        var vm = this;

        vm.match = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatoradeApp:matchUpdate', function(event, result) {
            vm.match = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
