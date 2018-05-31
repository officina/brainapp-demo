(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'DashboardService', '$stateParams', '$sce', '$interval'];

    function DashboardController ($scope, $rootScope, Principal, LoginService, $state, DashboardService, $stateParams) {

        var sessionid = $stateParams.sessions;
        var matches = $stateParams.matches;
        $scope.currentDate = new Date();
        $scope.currentDate = Date.parse($scope.currentDate);

        var bestScores = [];
        var best;
        $scope.getMatches = function(){
            DashboardService.getMatches($stateParams.extsessionid).then(function(response) {
                $scope.matches = response.data;
                console.log(response.data);
                console.log($scope.matches);
                $scope.currentDate = new Date();
                $scope.currentDate = Date.parse($scope.currentDate);
                $scope.levelgame = isLevelGame($scope.matches[0]) ? true : false;
                $scope.matchDuration = $scope.matches[0].template.maxDuration * 1000;

                for (var m in $scope.matches) {
                    if ($scope.matches[m].game.type == "POINT") {
                        if (!isNaN($scope.matches[m].bestScore)){
                            if ($scope.matches[m].bestScore == null || $scope.matches[m].bestScore == undefined){
                                $scope.matches[m].bestScore = 0;
                            }else{
                                bestScores.push(parseInt($scope.matches[m].bestScore));
                            }
                        }
                    } else if ($scope.matches[m].game.type == "MINPOINT") {
                        if (!isNaN($scope.matches[m].bestScore)){
                            if ($scope.matches[m].bestScore == null || $scope.matches[m].bestScore == undefined) {
                                $scope.matches[m].bestScore = 0;
                            }else{
                                bestScores.push(parseInt($scope.matches[m].bestScore));
                            }
                        }
                    } else if ($scope.matches[m].game.type == "LEVEL") {
                        if (!isNaN($scope.matches[m].bestScore)){
                            if ($scope.matches[m].bestScore == null || $scope.matches[m].bestScore == undefined){
                                $scope.matches[m].bestScore = '0';
                            }else{
                                bestScores.push(parseInt($scope.matches[m].bestLevel));
                            }
                        }
                    }
                }
                $scope.best = Math.max.apply(null, bestScores);
                if ($scope.best === null || $scope.best === undefined || isNaN($scope.best)){
                    $scope.best = '-'
                }
                $scope.numberOfMatches = $scope.matches.length;

                // $scope.best = 23435;
                // console.log($scope.best);
            });
        };

        $scope.getMatches();

        // questo richiama il servizio ogni 60 secondi
        var timer_id = setInterval($scope.getMatches, 60000);


        DashboardService.getSession($stateParams.extsessionid).then(function(response){
            $scope.sessions = response.data;
            // console.log($scope.currentDate);
            // console.log(Date.parse($scope.sessions.endDate));
            // console.log($scope.currentDate > Date.parse($scope.sessions.endDate))
            console.log($scope.sessions);
            if ($scope.currentDate > Date.parse($scope.sessions.endDate)) {
                $scope.stateSessionLabel = 'Terminato';
            } else {
                $scope.stateSessionLabel = 'In Corso';
            };
        });



        var isLevelGame =function (game){
            if (game.game.type === 'LEVEL') {
                // console.log('level');
                return true;
            } else {
                // console.log('point');
                return false;
            }
        };

        $scope.resetMatch = function (matchId) {
            console.log('Sending request for reset match with id: '+matchId);
            DashboardService.resetMatch(matchId)
                .then(function (response) {
                    $scope.getMatches();
                })
                .catch(function (error) {
                    console.log(error)
                })
        };

        $scope.elaborateMatch = function (matchId) {
            console.log('Sending request for elaborate match with id: '+matchId);
            DashboardService.elaborateMatch(matchId)
                .then(function (response) {
                    $scope.getMatches();
                })
                .catch(function (error) {
                    console.log(error)
                })
        };

        $scope.closeMatch = function (matchId) {
            console.log('Sending request for close match with id: '+matchId);
            DashboardService.closeMatch(matchId)
                .then(function (response) {
                    $scope.getMatches();
                })
                .catch(function (error) {
                    console.log(error)
                })
        };
    }
})();
