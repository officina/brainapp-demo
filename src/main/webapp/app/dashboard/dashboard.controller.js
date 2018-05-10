(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'DashboardService', '$stateParams', '$sce', '$interval'];

    function DashboardController ($scope, $rootScope, Principal, LoginService, $state, DashboardService, $stateParams) {

        var sessionId = $stateParams.sessionid;
        console.log('wololo');

        DashboardService.getSession(sessionId)
    }
})();
