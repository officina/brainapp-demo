(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('MatchTemplateDetailController', MatchTemplateDetailController);

    MatchTemplateDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'MatchTemplate', 'Game'];

    function MatchTemplateDetailController($scope, $rootScope, $stateParams, previousState, entity, MatchTemplate, Game) {
        var vm = this;

        vm.matchTemplate = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatoradeApp:matchTemplateUpdate', function(event, result) {
            vm.matchTemplate = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
