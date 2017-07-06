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
  var rootPath = '';
    //GET GAME
  this.getGame =  function getGame(gameId, userid, token, sessionid){
      return $http({
      	method: 'GET',
      	url: rootPath + '/api/games/' + gameId +  '?userid='+userid+'&playtoken='+token
      })
  };
  
  //GAME AUTH
  this.getGameInit =  function getGame(gameId, userid, extid){
      return $http({
      	method: 'GET',
      	url: rootPath + '/api/gamesinit/' + gameId +  '/' + extid + '/' + userid
      })
  };
  
    //CREATE MATCH
  this.createMatch = function(gameId, templateId, playerId,token, sessionId){
	  return $http({
      	method: 'POST',
      	url: rootPath+'/api/play',
      	data:{
        	gameid:gameId,
        	templateid: templateId,
        	playerid:playerId,
        	playtoken:token,
        	sessionid: sessionId
        }
	  })
  };
    //CREATE ATTEMPT
  this.createAttempt = function(gameId,templateId,playerId,token,matchId,sessionId){
	  return $http({
      	method: 'POST',
      	url: rootPath +'/api/play/attempt',
      	data:{
        	gameid:gameId,
        	templateid:templateId,
        	playerid:playerId,
        	playtoken:token,
        	matchid: matchId,
        	sessionid : sessionId
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
  this.endAttempt = function(gameId, attemptId, score, level, completed, endMatch){
	  return $http({
      	method: 'PUT',
      	url: rootPath +'/api/play/attempt/end',
      	data:{
        	gameid:gameId,
      		attemptid:attemptId,
      		score:score,
      		level:level,
      		completed:completed,
      		endmatch:endMatch
        }
	  })
  };


    this.updateScore = function(gameId, playerId, token, newValue){

      return $http({
        method: 'PUT',
        url: rootPath + '/api/play/score',
        data:{
          gameId:1101,
          attemptId:1,
          playerId:1,
          playtoken:"",
          newValue:32
        }
      })
    }

    //END MATCH
    this.endMatch = function(gameId, playerId, token, matchId, attemptId, level, score){
      return $http({
        method: 'PUT',
        url: rootPath + '/api/play/end',
        data:{
          gameid:gameId,
          playerid:playerId,
          token:token,
          matchid:matchId,
          attemptid:attemptId,
          level:level,
          score:score
        }
      })
    }

  }]);
