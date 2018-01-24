(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('ReportDetailController', ReportDetailController);

    ReportDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Report'];

    function ReportDetailController($scope, $rootScope, $stateParams, previousState, entity, Report) {
        var vm = this;

        vm.report = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('gatoradeApp:reportUpdate', function(event, result) {
            vm.report = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
