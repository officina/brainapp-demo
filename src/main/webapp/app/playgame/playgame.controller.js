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
    	$scope.lastProgress = 101;
    	$scope.matchToken = Date.now();
    	$scope.showGame = true;
    	$scope.showReport = true;
		$scope.showError = true;
    	// IE + others compatible event handler

        var addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
        var addEvent = window[addEventMethod];
        var removeEvent = window[removeEventMethod];
        var gameId = $stateParams.gameid;
        var playtoken = $stateParams.playtoken;
        var eventName = addEventMethod == "attachEvent" ? "onmessage" : "message";
        var useLevels = false;
        
        var setupOffline = function(){
        	$scope.showGame = false;
        	$scope.message1 = "Si è verificato un problema con la tua connessione";
        	$scope.message2 = "Ti preghiamo di inviare le informazioni che trovi in calce all\'amministratore del sistema.";
        	$scope.errorText = $rootScope.finalError;
	    	$scope.reportText = $rootScope.wrapperMemory;
        }
        
        var manageError = function(error, why){
        	removeEvent(eventName, $scope.handle);
        	$rootScope.wrapperMemory = $scope.wrapperMemory;
        	$rootScope.finalError = error;
        	if(navigator.online)
        	{
        		$state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : why});
        	}
        	else
        	{
        		setupOffline();
        	}
        }

        $scope.handle = function(e){
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
                case "STOP_ATTEMPT": // è un cancel attempt
                	console.log('STOP_ATTEMPT');
                    var endedInfo = e.data.attempt;
                    attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_ENDED":
                	console.log('ATTEMPT_ENDED');
                    var endedInfo = e.data.attempt;
                    attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_RESTARTED":
                	console.log('ATTEMPT_RESTARTED');
                	var endedInfo = e.data.attempt;
                    attemptRestarted(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
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
        addEvent(eventName, $scope.handle,false);

        $scope.$on('$locationChangeStart', function (event, next, current) {
        	console.log('locationChangeStart');
        	PlaygameService.report($scope.wrapperMemory.match.id,$stateParams.playtoken,$scope.wrapperMemory);
        	PlaygameService.syncEndMatch($scope.wrapperMemory.game.id,"",
					$stateParams.playtoken, 
					$scope.wrapperMemory.match.id, 
					$scope.wrapperMemory.currAttempt.id,
					$scope.wrapperMemory.currAttempt.score, 
					$scope.wrapperMemory.currAttempt.level);
            		removeEvent(eventName, $scope.handle);
        });

        $scope.game = {url:"htmlgames/loading.html"}
        
        $scope.$on('timer-tick', function (event, args) {
            if (args.seconds !== undefined){
                var myEl = angular.element( document.querySelector( '#game-header' ) );
                var timeToEnd = (args.minutes*60+args.seconds)
                var total =  (timeToEnd*100/$scope.wrapperMemory.match.template.maxDuration);
                $scope.progressBar = total <=100? total: 100
                var tk = args.seconds % 30;
                console.log($scope.wrapperMemory.currAttempt != undefined);
                if($scope.wrapperMemory.currAttempt != undefined && tk == 0)
                {
                	console.log('score/level update vs server')
                	PlaygameService.updateAttemptScore($scope.wrapperMemory.game.id,"",$stateParams.playtoken, $scope.wrapperMemory.match.id,
                			$scope.wrapperMemory.currAttempt.id, $scope.wrapperMemory.currAttempt.score, $scope.wrapperMemory.currAttempt.level,$scope.matchToken).then(function(response){
        	    		console.log('Score/Level updated');
        	    	})
                	.catch(function(error) {
        	        	PlaygameService.errorAsync($scope.wrapperMemory.match.id,$stateParams.playtoken,$scope.error);
                	});
                }
            }

        });

        PlaygameService.getGameInit(gameId, $stateParams.playtoken, $stateParams.extsessionid).then(function(response){
        	$scope.game = response.data;
          $scope.wrapperMemory.game = response.data;
          $scope.wrapperMemory.player = {};
          $scope.wrapperMemory.player.playtoken = playtoken;
          if($scope.game.type == 'LEVEL')
          {
        	  useLevels = true;
          }
          PlaygameService.createMatch($stateParams.gameid,null,$stateParams.playtoken,$stateParams.playtoken, $stateParams.extsessionid)
          .then(function(response){
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
          }).catch(function(error) {
	        	var why = "genericError";
	        	if(error.status == 400)
	    		{
	        		why = "invalidSession";
	    		}
	        	manageError(error, why);
	        });
        })
        .catch(function(error) {
        	var why = "genericError";
        	if(error.status == 400)
    		{
        		why = "invalidSession";
    		}
        	
        	manageError(error, why);
        });

        var startAttempt = function(){
        	if($scope.wrapperMemory.match == undefined)
        	{
        		console.log("creo attempt SENZA match");
        		PlaygameService.createAttempt(gameId,$stateParams.templateid, "", playtoken, null, $stateParams.extsessionid,$scope.matchToken)
        		.then(function(response){
        	        refreshWrapperMemory(response.data.match,response.data.attempt);
    	        })
    	        .catch(function(error) {
    	        	manageError(error, "genericError");
    	        });
    	        
        	}
        	else
        	{
        		console.log("creo attempt CON match");
        		PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken,$scope.wrapperMemory.match.id, $stateParams.extsessionid,$scope.matchToken)
        		.then(function(response){
        			refreshWrapperMemory(response.data.match,response.data.attempt);
      	        })
	      	   .catch(function(error) {
	      		   manageError(error, "genericError");
	  	        });
        	}
        	$scope.$broadcast('timer-start');
        };

	    var updateAttemptScore = function(score, level){
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
	    	PlaygameService.endAttempt(gameId,$scope.wrapperMemory.currAttempt.id,trueScore,trueLevel,completed,false,$scope.matchToken)
	    	.then(function(response){
	    		//chiuso l'attempt, il current è null
	    		$scope.wrapperMemory.currAttempt.stopAttempt = new Date(Date.now()).toLocaleString();
	    		$scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
	    		$scope.wrapperMemory.currAttempt = undefined;
	    		console.log('Attempt ended inside callback');
	    	})
	    	.catch(function(error) {
	    		manageError(error, "genericError");
  	        });
	    }
	    
	    var attemptRestarted = function(score, level, completed, endDate){
	    	var trueLevel = 0;
	    	var trueScore = 0;
	    	if(useLevels) {
	    		trueLevel = score;
	    	}
	    	else{
	    		trueScore = score;
	    	}
	    	console.log('Attempt restarted');
	    	PlaygameService.endAttempt(gameId,$scope.wrapperMemory.currAttempt.id,trueScore,trueLevel,completed,false,$scope.matchToken)
	    	.then(function(response){
	    		//chiuso l'attempt, il current è null
	    		$scope.wrapperMemory.currAttempt.stopAttempt = new Date(Date.now()).toLocaleString();
	    		$scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
	    		$scope.wrapperMemory.currAttempt = undefined;
	    		console.log('Attempt restarted inside callback');
	    		console.log($scope.wrapperMemory);
	    		startAttempt();
	    	})
	    	.catch(function(error) {
	    		manageError(error, "genericError");
	        });
	    }
	    
	    var refreshWrapperMemory = function(match, attempt)
	    {
	    	$scope.wrapperMemory.match = match;
			$scope.wrapperMemory.currAttempt = attempt;
			$scope.wrapperMemory.currAttempt.score = 0;
	        $scope.wrapperMemory.currAttempt.level = 0;
//	        $scope.wrapperMemory.attempts.push(attempt);
	    }

	   $scope.matchEnded = function(){
		   	console.log('Inside end match');
		   	removeEvent(eventName, $scope.handle);
	    	var currAttemptId = null;
	    	var currAttemptScore = null;
	    	var currAttemptLevel = null;
	    	if($scope.wrapperMemory.currAttempt != undefined)
	    	{
	    		var currAttemptId = $scope.wrapperMemory.currAttempt.id;
		    	var currAttemptScore = $scope.wrapperMemory.currAttempt.score;
		    	var currAttemptLevel = $scope.wrapperMemory.currAttempt.level;
	    	}
	    	//eseguo prima endmatch
	    	PlaygameService.endMatch($scope.wrapperMemory.game.id,"",$stateParams.playtoken, $scope.wrapperMemory.match.id, currAttemptId, currAttemptScore, currAttemptLevel,$scope.matchToken)
	    	.then(function(response){
	    		// se endmatch va a buon fine eseguo l'invio del report 
	    		PlaygameService.reportAsync($scope.wrapperMemory.match.id,$stateParams.playtoken, $scope.wrapperMemory)
    	    	.then(function(response){
    	    		$state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : "timeout"});
		    	})
		    	.catch(function(error) {
		    		//se l'invio del report non va a buon fine redirect alla pagina di errore
		    		PlaygameService.errorAsync($scope.wrapperMemory.match.id,$stateParams.playtoken,$scope.errorText);
		    		$state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : "genericError"});
		    	});
	    	})
	    	.catch(function(error) {
	    		manageError(error, "genericError");
  	        });
	    }

	    $scope.countDownCallbackFunction = function() {
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
        	$scope.wrapperMemory.match.stop = new Date(Date.now()).toLocaleString();
        	PlaygameService.report($scope.wrapperMemory.match.id,$stateParams.playtoken,$scope.wrapperMemory);
        	if($scope.wrapperMemory.currAttempt == undefined)
	    	{
        		PlaygameService.syncEndMatch($scope.wrapperMemory.game.id,"",
						$stateParams.playtoken, 
						$scope.wrapperMemory.match.id, 
						undefined,
						undefined, 
						undefined,
						$scope.matchToken);
	    	}
        	else
        	{
	        	PlaygameService.syncEndMatch($scope.wrapperMemory.game.id,"",
						$stateParams.playtoken, 
						$scope.wrapperMemory.match.id, 
						$scope.wrapperMemory.currAttempt.id,
						$scope.wrapperMemory.currAttempt.score, 
						$scope.wrapperMemory.currAttempt.level,
						$scope.matchToken);
        	}
        	
            if(typeof beforeUnloadTimeout != 'undefined' && beforeUnloadTimeout != 0) {
                clearTimeout(beforeUnloadTimeout);
            }
            removeEvent(eventName, $scope.handle)
        });
    }
})();
