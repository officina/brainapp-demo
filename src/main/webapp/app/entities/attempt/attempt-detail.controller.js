(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('AttemptDetailController', AttemptDetailController);

    AttemptDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Attempt', 'Match'];

    function AttemptDetailController($scope, $rootScope, $stateParams, previousState, entity, Attempt, Match) {
        var vm = this;

        vm.attempt = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatoradeApp:attemptUpdate', function(event, result) {
            vm.attempt = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
