(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('SessionDetailController', SessionDetailController);

    SessionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Session', 'Match', 'Game'];

    function SessionDetailController($scope, $rootScope, $stateParams, previousState, entity, Session, Match, Game) {
        var vm = this;

        vm.session = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatoradeApp:sessionUpdate', function(event, result) {
            vm.session = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
