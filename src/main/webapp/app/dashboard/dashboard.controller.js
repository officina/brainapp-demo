(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'DashboardService', '$stateParams', '$uibModal'];

    function DashboardController ($scope, $rootScope, Principal, LoginService, $state, DashboardService, $stateParams, $uibModal) {
        $scope.isOnline = true;
        Offline.on("up", function () {
            $scope.isOnline = true;
        });
        Offline.on("down", function () {
            $scope.isOnline = false;
        });
        $scope.currentDate = new Date();
        $scope.currentDate = Date.parse($scope.currentDate);
        $scope.rightSession = true;
        var vm= this;
        var bestScores = [];
        $scope.resetMessage = 'Annulla la giocata corrente e permette di avviarne una nuova';
        $scope.closeMessage = 'Chiude la giocata e invia il punteggio alla leaderboard';
        $scope.elaborateMessage = 'Invia il punteggio attuale alla leaderboard';
        $scope.populatedMatches = true;
        $scope.getMatches = function(){
            DashboardService.getMatches($stateParams.extsessionid).then(function(response) {
                $scope.matches = response.data;
                // console.log(response.data);
                // console.log($scope.matches);
                $scope.currentDate = new Date();
                if ($scope.matches.length < 1) {
                    $scope.populatedMatches = false;
                } else {
                    $scope.currentDate = Date.parse($scope.currentDate);
                    $scope.levelgame = isLevelGame($scope.matches[0]) ? true : false;
                    $scope.matchDuration = $scope.matches[0].template.maxDuration * 1000;
                    for (var m in $scope.matches) {
                        if ($scope.matches[m].game.type == "POINT") {
                            if (!isNaN($scope.matches[m].bestScore)) {
                                if ($scope.matches[m].bestScore == null || $scope.matches[m].bestScore == undefined) {
                                    $scope.matches[m].bestScore = 0;
                                } else {
                                    bestScores.push(parseInt($scope.matches[m].bestScore));
                                }
                            }
                        } else if ($scope.matches[m].game.type == "MINPOINT") {
                            if (!isNaN($scope.matches[m].bestScore)) {
                                if ($scope.matches[m].bestScore == null || $scope.matches[m].bestScore == undefined) {
                                    $scope.matches[m].bestScore = 0;
                                } else {
                                    bestScores.push(parseInt($scope.matches[m].bestScore));
                                }
                            }
                        } else if ($scope.matches[m].game.type == "LEVEL") {
                            if (!isNaN($scope.matches[m].bestLevel)) {
                                if ($scope.matches[m].bestLevel == null || $scope.matches[m].bestLevel == undefined) {
                                    $scope.matches[m].bestLevel = 0;
                                } else {
                                    bestScores.push(parseInt($scope.matches[m].bestLevel));
                                }
                            }
                        }
                    }
                    if ($scope.matches[m].game.type === "MINPOINT") {
                        $scope.best = Math.min.apply(null, bestScores);
                    }else{
                        $scope.best = Math.max.apply(null, bestScores);
                    }
                    if ($scope.best === null || $scope.best === undefined || isNaN($scope.best) || $scope.best === -Infinity){
                        $scope.best = '-'
                    }
                    $scope.numberOfMatches = $scope.matches.length;
                }


                // $scope.best = 23435;
                // console.log($scope.best);
            })
            .catch(function (error) {
                console.log(error)
                // console.log(timer_id)
                $scope.populatedMatches = false;

            });
        };

        $scope.getMatches();

        // questo richiama il servizio ogni 60 secondi
        var timer_id = setInterval($scope.getMatches, 60000);


        $scope.getSession = function() {
            DashboardService.getSession($stateParams.extsessionid)
                .then(function (response) {
                $scope.sessions = response.data;
                $scope.rightSession = true;
                // console.log($scope.currentDate);
                // console.log(Date.parse($scope.sessions.endDate));
                // console.log($scope.currentDate > Date.parse($scope.sessions.endDate))
                // console.log($scope.sessions);
                if ($scope.currentDate > Date.parse($scope.sessions.endDate)) {
                    $scope.stateSessionLabel = 'Terminato';
                } else {
                    $scope.stateSessionLabel = 'In Corso';
                }
            })
            .catch(function (error) {
                console.log(error)
                // console.log(timer_id)
                $scope.rightSession = false;
                clearInterval(session_timer);
                clearInterval(timer_id);
                if (error.status == 404) {
                    $scope.errorMes = 'La sessione che cerchi non risulta disponibile';
                } else if (!$scope.isOnline) {
                    $scope.errorMes = 'La sessione che cerchi non risulta disponibile, sembra che tu sia offline!';
                } else {
                    $scope.errorMes = 'La sessione che cerchi sembra non essere disponibile, prova a ricaricare la pagina';
                }
            })
        };
        $scope.getSession();
        var session_timer = setInterval($scope.getSession, 60000);


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

        var $ctrl = this;

        $ctrl.ok = function () {
            console.log("ok component");
            $scope.$close();
        };

        $ctrl.cancel = function () {
            console.log("cancel component");
            $scope.$dismiss({$value: 'cancel'});
        };

        $scope.openModal = function (id, action) {
            var modalInstance  = $uibModal.open({
                animation: true,
                controllerAs: '$ctrl',
                controller: 'DashboardController',
                templateUrl: 'app/dashboard/popup.html',
                resolve: {
                  action: function () {
                      $scope.action = action;
                  },
                    id: function () {
                        $scope.id = id;
                    }
                },
                size: 'md'
            });

            modalInstance.result.then(function (value) {
                if ($scope.action === 'resetta'){
                    console.log('Modal reset match with id '+ $scope.id);
                    $scope.resetMatch($scope.id);
                }else if ($scope.action === 'elabora'){
                    console.log('Modal elaborate match with id '+ $scope.id);
                    $scope.elaborateMatch($scope.id);
                } else if ($scope.action === 'chiudi'){
                    console.log('Modal close match with id '+ $scope.id);
                    $scope.closeMatch($scope.id);
                }
            }, function (value) {
                console.log('fail Modal dismissed at: ' + new Date());
            });
        };
    }
})();
