(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$rootScope', '$timeout', '$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function NavbarController ($state, $rootScope, $timeout, $scope, Auth, Principal, ProfileService, LoginService) {
        var vm = this;
        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;
        vm.countdownVal = 50; 
        
        ProfileService.getProfileInfo().then(function(response) {
            vm.inProduction = response.inProduction;
            vm.swaggerEnabled = response.swaggerEnabled;
        });

        vm.login = login;
        vm.logout = logout;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;
        vm.startClock = startClock;
        vm.countDownCallbackFunction = countDownCallbackFunction;
        
        function countDownCallbackFunction() {
            $timeout(function() {
            	$rootScope.countDownCallbackFunction();
            });
        }
        
        function login() {
            collapseNavbar();
            LoginService.open();
        }
        
        function startClock() {
            $rootScope.$broadcast('timer-add-cd-seconds', 5);
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }
    }
})();
