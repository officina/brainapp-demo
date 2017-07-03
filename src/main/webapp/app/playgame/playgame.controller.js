(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameController', PlaygameController);

    PlaygameController.$inject = ['$scope', 'Principal', 'LoginService', '$state', 'PlaygameService','$sce', '$stateParams'];

    function PlaygameController ($scope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams) {

    	$scope.wrapperMemory = {};
    	$scope.wrapperMemory.attempts = [];
    	// IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {

            console.log("received action: " + e.data.action);
            console.log(e);
            switch (e.data.action){
                case "UPDATE_LEVEL":

                    break;
                case "UPDATE_SCORE":
                	console.log('New score: ' + e.data.attempt.score);
                	updateAttemptScore(e.data.attempt.score);
                    break;
                case "START_ATTEMPT":
                	startAttempt();
                	//console.log('Creazione attempt');
                    break;
                case "STOP_ATTEMPT": //è un cancel attempt
                	console.log('ATTEMPT_ENDED');
                	var endedInfo = e.data.attempt;
                	attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_ENDED":
                	console.log('ATTEMPT_ENDED');
                	var endedInfo = e.data.attempt;
                	attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "GAME_LOADED":

                    break;
                case "GAME_UNLOADED":

                    break;

                default:

                    break;
            }
//          PlaygameService.updateScore(1101,2,234,45)
        },false);


        $scope.game = {url:"htmlgames/loading.html"}

        var updateScoreWithValue = function(value){
          PlaygameService.updateScore(1101,2,234,45)
        }

        $scope.game.gameEndedWithValue = function(value){
          PlaygameService.endGame(1101,2,234,45)
        }

        var gameId = $stateParams.gameid;
        var playtoken = $stateParams.playtoken;
        PlaygameService.getGame(gameId, "", playtoken).then(function(response){
          var game = response.data
          game.url = $sce.trustAsResourceUrl(response.data.url)
          $scope.game = game
          $scope.wrapperMemory.game = game;
          $scope.wrapperMemory.player = {};
          $scope.wrapperMemory.player.playtoken = playtoken;
        })

        var startAttempt = function(){
        	if($scope.wrapperMemory.match == undefined)
        	{
        		PlaygameService.createAttempt(gameId,$stateParams.templateid, "", playtoken,null).then(function(response){
    	          console.log($stateParams.templateid);
    	          $scope.wrapperMemory.match = response.data.match;
    	          $scope.wrapperMemory.currAttempt = response.data.attempt;
    	          $scope.wrapperMemory.attempts.push(response.data.attempt);
    	          console.log('WRAPPER MEMORY INIZIO');
    	          console.log($scope.wrapperMemory);
    	          console.log('WRAPPER MEMORY FINE');
    	        });
        	}
        	else
        	{
        		PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken,$scope.wrapperMemory.match.id).then(function(response){
      	          console.log(response.data);
      	          $scope.wrapperMemory.match = response.data.match;
      	          $scope.wrapperMemory.currAttempt = response.data.attempt;
      	          $scope.wrapperMemory.attempts.push(response.data.attempt);
      	        });
        	}
        };
	    var updateAttemptScore = function(value){
	    	console.log('dentro uopdateAttemptScore');
	    	$scope.wrapperMemory.currAttempt.score = value;
	    	console.log($scope.wrapperMemory.currAttempt);
	    };
	    
	    var attemptEnded = function(score, level, completed, endDate){
	    	 //function(gameId, attemptId, score, level, completed)
	    	PlaygameService.endAttempt($scope.wrapperMemory.game.id,$scope.wrapperMemory.currAttempt.id,score,level,completed).then(function(response){
	    		console.log('FINIO');
	    		console.log(response);
	    	});
	    	console.log('WRAPPER MEMORY INIZIO');
          console.log($scope.wrapperMemory);
          console.log('WRAPPER MEMORY FINE');
	    }
    }
})();
