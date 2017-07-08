(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameController', PlaygameController);

    PlaygameController.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'PlaygameService','$sce', '$stateParams'];

    function PlaygameController ($scope, $rootScope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams,timer) {

    	$scope.wrapperMemory = {};
    	$scope.wrapperMemory.attempts = [];
    	// IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        
        // Listen to message from child window
        eventer(messageEvent,function(e) {

            console.log("RECEIVED ACTION: " + e.data.action);
            console.log(e.data);
            
            switch (e.data.action){
                case "UPDATE_LEVEL":
                    break;
                case "UPDATE_SCORE":
                	updateAttemptScore(e.data.attempt.score);
                    break;
                case "START_ATTEMPT":
                	startAttempt();
                    break;
                case "STOP_ATTEMPT": //è un cancel attempt
                	var endedInfo = e.data.attempt;
                	attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_ENDED":
                	var endedInfo = e.data.attempt;
                	console.log("Punteggio da aggiornare "+ endedInfo.score);
                	attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "GAME_LOADED":
                    break;
                case "GAME_UNLOADED":
                    break;
                default:
                    break;
            }
        },false);


        $scope.game = {url:"htmlgames/loading.html"}

        var gameId = $stateParams.gameid;
        var playtoken = $stateParams.playtoken;
        
        PlaygameService.getGameInit(gameId, $stateParams.playtoken, $stateParams.extsessionid).then(function(response){
          var game = response.data
          game.url = $sce.trustAsResourceUrl(response.data.url)
          $scope.game = game
          $scope.wrapperMemory.game = game;
          $scope.wrapperMemory.player = {};
          $scope.wrapperMemory.player.playtoken = playtoken;
          PlaygameService.createMatch($stateParams.gameid,null,$stateParams.playtoken,$stateParams.playtoken, $stateParams.extsessionid).then(function(response){
        	  $scope.wrapperMemory.match = response.data.match;
    		  var timeSpent = $scope.wrapperMemory.match.timeSpent;
    		  if(timeSpent < $scope.wrapperMemory.match.template.maxDuration)
        	  {
    			  var myTime = $scope.wrapperMemory.match.template.maxDuration-timeSpent;
    			  console.log('Start a new session with a duration ' + myTime);
        		  $rootScope.$broadcast('timer-set-countdown-seconds', myTime);
        	  }
    		  else
    		  {
        		  console.log('Tempo scaduto in quanto il tempo massimo è ' + $scope.wrapperMemory.match.template.maxDuration +' è quello giocato è ' + timeSpent);
        		  $state.go("ended", { "gameid": $stateParams.gameid, "playtoken": $stateParams.playtoken, "sessionid": $stateParams.extsessionid, "why" : "timeout"});
        	  }
          })
        })
        .catch(function(error) {
        	console.log('erro on validation');
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
      	          	$scope.wrapperMemory.attempts.push(response.data.attempt);
      	        });
        	}
        };
	    var updateAttemptScore = function(value){
	    	$scope.wrapperMemory.currAttempt.score = value;
	    };
	    
	    var attemptEnded = function(score, level, completed, endDate){
	    	PlaygameService.endAttempt($scope.wrapperMemory.game.id,$scope.wrapperMemory.currAttempt.id,score,level,completed,false).then(function(response){
	    		console.log('Attempt ended');
	    		console.log(response);
	    	});
	    }
	    
	   $scope.matchEnded = function(){
		   	console.log('Inside end match');
	    	var currAttemptId = null;
	    	var currAttemptScore = null;
	    	var currAttemptLevel = null;
	    	console.log($scope.wrapperMemory);
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
	    
	    $rootScope.countDownCallbackFunction = function() {
	    	$scope.matchEnded();
        };

        var beforeUnloadTimeout = 0 ;
        $(window).bind('beforeunload', function()  {
            console.log('beforeunload');
            beforeUnloadTimeout = setTimeout(function() {
                console.log('settimeout function');
            },500);
            return 'are you sure';
        });
        $(window).bind('unload', function() {
            var http = new XMLHttpRequest();
            http.open("PUT", '/api/play/end', false);
            http.setRequestHeader("Content-type", "application/json");
            var dataPut = {};
            dataPut.gameid = $scope.wrapperMemory.game.id;
            dataPut.playerid = "";
            dataPut.token = $stateParams.playtoken;
            dataPut.matchid = $scope.wrapperMemory.match.id;
            dataPut.attemptid = null;
            dataPut.level = null;
            dataPut.score = null;
            if($scope.wrapperMemory.currAttempt != undefined)
	    	{
            	dataPut.attemptid = $scope.wrapperMemory.currAttempt.id;
            	dataPut.level = $scope.wrapperMemory.currAttempt.score;
            	dataPut.score = $scope.wrapperMemory.currAttempt.level;
	    	}
    		http.send(JSON.stringify(dataPut));
            if(typeof beforeUnloadTimeout !=='undefined' && beforeUnloadTimeout != 0)
                clearTimeout(beforeUnloadTimeout);
        });
    }
})();
