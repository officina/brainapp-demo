(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .controller('MatchTemplateDetailController', MatchTemplateDetailController);

    MatchTemplateDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'MatchTemplate', 'Game'];

    function MatchTemplateDetailController($scope, $rootScope, $stateParams, previousState, entity, MatchTemplate, Game) {
        var vm = this;

        vm.matchTemplate = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('brainappbackendApp:matchTemplateUpdate', function(event, result) {
            vm.matchTemplate = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
