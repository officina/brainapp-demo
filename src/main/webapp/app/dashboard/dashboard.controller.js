(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'DashboardService', '$stateParams', '$sce', '$interval'];

    function DashboardController ($scope, $rootScope, Principal, LoginService, $state, DashboardService, $stateParams) {

        var sessionid = $stateParams.sessions;
        var matches = $stateParams.matches;

        DashboardService.getSession($stateParams.extsessionid).then(function(response){
            $scope.sessions = response.data;
        });

        DashboardService.getMatches($stateParams.extsessionid).then(function(response) {
            $scope.matches = response.data;
            // console.log(response.data);
            // console.log($scope.matches);
            $scope.levelgame = isLevelGame($scope.matches[0]) ? true : false;
            // console.log($scope.levelgame);
            $scope.matchDuration = $scope.matches[0].template.maxDuration * 1000;
            $scope.currentDate = new Date();
            $scope.currentDate = Date.parse($scope.currentDate);
            // console.log($scope.matchDuration);
            // console.log(typeof $scope.matches[0].bestLevel)
        });
        var isLevelGame =function (game){
            // console.log('dentro')
            if (game.game.type === 'LEVEL') {
                // console.log('level');
                return true;
            } else {
                // console.log('point');
                return false;
            }
        }

        $scope.resetMatch = function (matchId) {
            console.log('Sending request for reset match with id: '+matchId);
            DashboardService.resetMatch(matchId)
                .then(function (response) {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }
})();
