'use strict';

/**
 * @ngdoc service
 * @name desktopApp.GameService
 * @description
 * # GameService
 * Service in the desktopApp.
 */
angular.module('gatoradeApp')
  .service('PlaygameService', ['$http',function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //noinspection JSAnnotator
  var rootPath = 'http://localhost:8080';  
    //GET GAME
  this.getGame =  function getGame(gameId, playerId, token){
	  console.log("calling http service")
      //$http.get('http://localhost:8080/api/playgame?gameId=1051&playerId=1&playtoken=asdad')
      return $http({
      	method: 'GET',
      	url: rootPath + '/api/games/' + gameId +  '?playerId=1&playtoken='+token
      })
  }
    //CREATE MATCH
  this.createMatch = function(gameId,playerId,token){
	  return $http({
      	method: 'POST',
      	url: rootPath+'/api/play',
      	data:{
        	gameid:gameId,
        	playerid:playerId,
        	playtoken:token
        }
	  })
  };
    //CREATE ATTEMPT
  this.createAttempt = function(gameId,playerId,token,matchId){
	  return $http({
      	method: 'POST',
      	url: rootPath +'/api/play/attempt',
      	data:{
        	gameid:gameId,
        	playerid:playerId,
        	playtoken:token,
        	matchid: matchId
        }
	  })
  };
    //UPDATE ATTEMPT
  this.updateAttempt = function(gameId,playerId,token,matchId,attemptId,level,score){
	  return $http({
      	method: 'PUT',
      	url: rootPath +'/api/play/attempt/score',
      	data:{
        	gameid:gameId,
        	playerid: playerId,
        	token:token,
        	matchid:matchId,
      		attemptid:attemptId,
        	level:level,
        	score:score
        }
	  })
  };
    //CLOSE ATTEMPT
  this.updateAttemptScore = function(gameId,playerId,token,matchId,attemptId){
	  return $http({
      	method: 'PUT',
      	url: rootPath +'/api/play/attempt/end',
      	data:{
        	gameid:gameId,
        	playerid: playerId,
        	token:token,
        	matchid:matchId,
      		attemptid:attemptId
        }
	  })
  };
    //END MATCH

    
    this.updateScore = function(gameId, playerId, token, newValue){

      return $http({
        method: 'PUT',
        url: 'http://localhost:8080/api/play/score',
        data:{
          gameId:1101,
          attemptId:1,
          playerId:1,
          playtoken:"",
          newValue:32
        }
      })
    }

    this.endGame = function(gameId, playerId, token, finalValue){
      return $http({
        method: 'PUT',
        url: 'http://localhost:8080/api/play/end',
        data:{
          gameId:1101,
          attemptId:1,
          playerId:1,
          playtoken:"",
          newValue:32
        }
      })
    }
    
  }]);
