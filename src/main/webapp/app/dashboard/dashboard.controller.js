(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'DashboardService', '$stateParams', '$sce', '$interval'];

    function DashboardController ($scope, $rootScope, Principal, LoginService, $state, DashboardService, $stateParams) {

        var sessionid = $stateParams.sessions;
        var matches = $stateParams.matches;
        // console.log('wololo');

        DashboardService.getSession($stateParams.extsessionid).then(function(response){
            $scope.sessions = response.data;
        });

        DashboardService.getMatches($stateParams.extsessionid).then(function(response) {
            $scope.matches = response.data;
        })

    }
})();
