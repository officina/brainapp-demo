(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'PlaygameService'];

    function DashboardController ($scope, $rootScope, Principal, LoginService, $state, PlaygameService) {

    }
})();
