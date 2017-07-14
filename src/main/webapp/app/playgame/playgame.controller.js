(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameController', PlaygameController);

    PlaygameController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'PlaygameService','$sce', '$stateParams','$interval'];

    function PlaygameController ($scope, $rootScope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams,timer, $interval) {


    	$scope.wrapperMemory = {};
    	$scope.wrapperMemory.attempts = [];
    	$scope.timerOn = true
    	$scope.updateCount = 0;
    	// IE + others compatible event handler

        var addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
        var addEvent = window[addEventMethod];
        var removeEvent = window[removeEventMethod];
        var gameId = $stateParams.gameid;
        var playtoken = $stateParams.playtoken;
        var eventName = addEventMethod == "attachEvent" ? "onmessage" : "message";
        var useLevels = false;

        var handle = function(e){

            switch (e.data.action){
                case "UPDATE_LEVEL":
                	console.log('UPDATE_LEVEL');
                    updateAttemptScore(e.data.attempt.score, e.data.attempt.level);
                    break;
                case "UPDATE_SCORE":
                	console.log('UPDATE_SCORE');
                    updateAttemptScore(e.data.attempt.score, e.data.attempt.level);
                    break;
                case "START_ATTEMPT":
                	console.log('START_ATTEMPT');
                    startAttempt();
                    break;
                case "STOP_ATTEMPT": //è un cancel attempt
                	console.log('STOP_ATTEMPT');
                    var endedInfo = e.data.attempt;
                    attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_ENDED":
                	console.log('ATTEMPT_ENDED');
                    var endedInfo = e.data.attempt;
                    attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "GAME_LOADED":
                	console.log('GAME_LOAD');
                    break;
                case "GAME_UNLOADED":
                	console.log('GAME_UNLOAD');
                    break;
                default:
                    break;
            }
        }
        // Listen to message from child window
        addEvent(eventName, handle,false);

        $scope.$on('$locationChangeStart', function (event, next, current) {
        	PlaygameService.syncEndMatch($scope.wrapperMemory.game.id,"",
					$stateParams.playtoken, 
					$scope.wrapperMemory.match.id, 
					$scope.wrapperMemory.currAttempt.id,
					$scope.wrapperMemory.currAttempt.score, 
					$scope.wrapperMemory.currAttempt.level);
            removeEvent(eventName, handle);
        });

        $scope.game = {url:"htmlgames/loading.html"}
        $scope.$on('timer-tick', function (event, args) {

            if (args.seconds !== undefined){
                var myEl = angular.element( document.querySelector( '#game-header' ) );
                console.log('Seconds before next server update ' + args.seconds % 30);

                var timeToEnd = (args.minutes*60+args.seconds)
                var total =  (timeToEnd*100/$scope.wrapperMemory.match.template.maxDuration)
                $scope.progressBar = total <=100? total: 100

                var tk = args.seconds % 30;
                if($scope.wrapperMemory.currAttempt != undefined && tk == 0)
                {
                	console.log('score/level update vs server')
                	//this.updateAttemptScore = function(gameId,playerId,token,matchId,attemptId,level,score){
                	PlaygameService.updateAttemptScore($scope.wrapperMemory.game.id,"",$stateParams.playtoken, $scope.wrapperMemory.match.id,
                			$scope.wrapperMemory.currAttempt.id, $scope.wrapperMemory.currAttempt.score, $scope.wrapperMemory.currAttempt.level).then(function(response){
        	    		console.log('Score/Level updated');
        	    	});
                }
            }

        });

        PlaygameService.getGameInit(gameId, $stateParams.playtoken, $stateParams.extsessionid).then(function(response){
          var game = response.data;
          game.url = $sce.trustAsResourceUrl(response.data.url);
          $scope.game = game;
          $scope.wrapperMemory.game = game;
          $scope.wrapperMemory.player = {};
          $scope.wrapperMemory.player.playtoken = playtoken;
          if($scope.game.type == 'LEVEL')
          {
        	  useLevels = true;
          }
          PlaygameService.createMatch($stateParams.gameid,null,$stateParams.playtoken,$stateParams.playtoken, $stateParams.extsessionid).then(function(response){
        	  $scope.wrapperMemory.match = response.data.match;
    		  var timeSpent = $scope.wrapperMemory.match.timeSpent;

    		  if(timeSpent < $scope.wrapperMemory.match.template.maxDuration)
        	  {
    			  var myTime = $scope.wrapperMemory.match.template.maxDuration-timeSpent;
    			  console.log('Start a new session with a duration ' + myTime);
        		  $scope.$broadcast('timer-set-countdown-seconds', myTime);
        	  }
    		  else
    		  {
        		  console.log('Tempo scaduto in quanto il tempo massimo è ' + $scope.wrapperMemory.match.template.maxDuration +' è quello giocato è ' + timeSpent);
        		  $state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : "timeout"});
        	  }
          })
        })
        .catch(function(error) {
        	console.log('error on validation');
        	console.log(error);
        	$state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : "invalidSession"});
        });

        var startAttempt = function(){
        	if($scope.wrapperMemory.match == undefined)
        	{
        		console.log("creo attempt SENZA match");
        		PlaygameService.createAttempt(gameId,$stateParams.templateid, "qwqwqwqw", playtoken, null, $stateParams.extsessionid).then(function(response){
        			console.log(response.data);
        			$scope.wrapperMemory.match = response.data.match;
        			$scope.wrapperMemory.currAttempt = response.data.attempt;
        			$scope.wrapperMemory.currAttempt.score = 0;
        	        $scope.wrapperMemory.currAttempt.level = 0;
        	        $scope.wrapperMemory.attempts.push(response.data.attempt);
    	        });
        	}
        	else
        	{
        		console.log("creo attempt CON match");
        		PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken,$scope.wrapperMemory.match.id, $stateParams.extsessionid).then(function(response){
        			console.log(response.data);
      	          	$scope.wrapperMemory.match = response.data.match;
      	          	$scope.wrapperMemory.currAttempt = response.data.attempt;
      	          	$scope.wrapperMemory.currAttempt.score = 0;
      	          	$scope.wrapperMemory.currAttempt.level = 0;
      	        	$scope.wrapperMemory.attempts.push(response.data.attempt);
      	        });
        	}
        	$scope.$broadcast('timer-start');
        };

	    var updateAttemptScore = function(score, level){
	    	console.log("updateAttemptScore");
	    	console.log($scope.wrapperMemory.currAttempt);
	    	if($scope.wrapperMemory.currAttempt == undefined)
	    		return;
	    	$scope.updateCount = $scope.updateCount + 1;
	    	$scope.wrapperMemory.currAttempt.score = score;
	    	$scope.wrapperMemory.currAttempt.level = level;
	    };

	    var attemptEnded = function(score, level, completed, endDate){
	    	var trueLevel = 0;
	    	var trueScore = 0;
	    	if(useLevels) {
	    		trueLevel = score;
	    	}
	    	else{
	    		trueScore = score;
	    	}
	    	console.log('Attempt ended');
	    	PlaygameService.endAttempt(gameId,$scope.wrapperMemory.currAttempt.id,trueScore,trueLevel,completed,false).then(function(response){
	    		console.log('Attempt ended');
	    		console.log(response);
	    	});
	    }

	   $scope.matchEnded = function(){
		   	console.log('Inside end match');
	    	var currAttemptId = null;
	    	var currAttemptScore = null;
	    	var currAttemptLevel = null;
	    	if($scope.wrapperMemory.currAttempt != undefined)
	    	{
	    		var currAttemptId = $scope.wrapperMemory.currAttempt.id;
		    	var currAttemptScore = $scope.wrapperMemory.currAttempt.score;
		    	var currAttemptLevel = $scope.wrapperMemory.currAttempt.level;
	    	}
	    	PlaygameService.endMatch($scope.wrapperMemory.game.id,"",$stateParams.playtoken, $scope.wrapperMemory.match.id, currAttemptId, currAttemptScore, currAttemptLevel).then(function(response){
	    		console.log('Match ended');
	    		$state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : "timeout"});
	    	});
	    }

	    $scope.countDownCallbackFunction = function() {
	    	console.log('time spent!!!');
	    	$scope.matchEnded();
        };

        var beforeUnloadTimeout = 0 ;
        $(window).bind('beforeunload', function()  {
            console.log('beforeunload');
            beforeUnloadTimeout = setTimeout(function() {
                console.log('settimeout function');
            },500);
            return 'Se chiudi la finestra o cambi indirizzo la tua sessione sarà invalidata! Vuoi procedere comunque?';
        });

        $(window).bind('unload', function() {
        	console.log('event');
        	if($scope.wrapperMemory.currAttempt == undefined)
	    	{
        		console.log("put request for attempt closure non necessary");
        		return;
	    	}
        	PlaygameService.syncEndMatch($scope.wrapperMemory.game.id,"",
        									$stateParams.playtoken, 
        									$scope.wrapperMemory.match.id, 
        									$scope.wrapperMemory.currAttempt.id,
        									$scope.wrapperMemory.currAttempt.score, 
        									$scope.wrapperMemory.currAttempt.level);
        	
            if(typeof beforeUnloadTimeout != 'undefined' && beforeUnloadTimeout != 0) {
                clearTimeout(beforeUnloadTimeout);
            }
            removeEvent(eventName, handle)
        });
    }
})();
