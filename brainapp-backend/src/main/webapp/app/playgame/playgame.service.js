'use strict';

/**
 * @ngdoc service
 * @name desktopApp.GameService
 * @description
 * # GameService
 * Service in the desktopApp.
 */
angular.module('brainappbackendApp')
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
      	url: rootPath + '/api/play/' + gameId +  '/init/' + extid + '/' + userid
      })
  };

    //CREATE MATCH
  this.createMatch = function(gameId, templateId, playerId,token, sessionId, matchToken){
	  return $http({
      	method: 'POST',
      	url: rootPath+'/api/play',
      	data:{
        	gameid:gameId,
        	templateid: templateId,
        	playerid:playerId,
        	playtoken:token,
        	sessionid: sessionId,
        	matchtoken: matchToken
        }
	  })
  };
    //CREATE ATTEMPT
  this.createAttempt = function(gameId,templateId,playerId,token,matchId,sessionId, matchToken){
	  return $http({
      	method: 'POST',
      	url: rootPath +'/api/play/attempt',
      	data:{
        	gameid:gameId,
        	templateid:templateId,
        	playerid:playerId,
        	playtoken:token,
        	matchid: matchId,
        	sessionid: sessionId,
        	matchtoken: matchToken
        }
	  })
  };
    //UPDATE ATTEMPT
  this.updateAttemptScore = function(gameId,playerId,token,matchId,attemptId,score,level, matchToken){
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
        	score:score,
        	matchtoken: matchToken
        }
	  })
  };
    //CLOSE ATTEMPT
  this.endAttempt = function(gameId, attemptId, score, level, completed, endMatch, matchToken){
	  return $http({
      	method: 'PUT',
      	url: rootPath +'/api/play/attempt/end',
      	data:{
        	gameid:gameId,
      		attemptid:attemptId,
      		score:score,
      		level:level,
      		completed:completed,
      		endmatch:endMatch,
      		matchtoken: matchToken
        }
	  })
  };

    //END MATCH
    this.endMatch = function(gameId, playerId, token, matchId, attemptId, score, level, matchToken){
      return $http({
        method: 'PUT',
        url: rootPath + '/api/play/end',
        data:{
          gameid:gameId,
          playerid:playerId,
          token:token,
          matchid:matchId,
          attemptid:attemptId,
          score:score,
          level:level,
          matchtoken: matchToken
        }
      })
    }
    
    this.syncEndMatch = function(gameId, playerId, token, matchId, attemptId, score, level, matchToken){
        var http = new XMLHttpRequest();
        http.open("PUT", '/api/play/end', false);
        http.setRequestHeader("Content-type", "application/json");
        var dataPut = {};
        dataPut.gameid = gameId;
        dataPut.playerid = playerId;
        dataPut.token = token;
        dataPut.matchid = matchId;
    	dataPut.attemptid = attemptId;
    	dataPut.score = score;
    	dataPut.level = level;
    	dataPut.matchtoken = matchToken;
		http.send(JSON.stringify(dataPut));
    }

  }]);