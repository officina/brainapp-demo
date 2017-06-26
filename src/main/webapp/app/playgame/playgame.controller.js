(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameController', PlaygameController);

    PlaygameController.$inject = ['$scope', 'Principal', 'LoginService', '$state', 'PlaygameService','$http','$sce'];

    function PlaygameController ($scope, Principal, LoginService, $state, PlaygameService, $http,$sce) {
    	
    	console.log(PlaygameService);
    	
    	// IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {
          console.log('game ended with:  ', e.data)
          console.log("game ended! with " + e.data.gameEnd.endPoints + " points")
          PlaygameService.updateScore(1101,2,234,45)
        },false);


        $scope.game = {}

        var updateScoreWithValue = function(value){
          PlaygameService.updateScore(1101,2,234,45)
        }

        $scope.game.gameEndedWithValue = function(value){
          PlaygameService.endGame(1101,2,234,45)
        }

        PlaygameService.getGame(1051, 13, "asd").then(function(response){
          var game = response.data
          game.url = $sce.trustAsResourceUrl(response.data.url)
          $scope.game = game


        })
    }
})();
