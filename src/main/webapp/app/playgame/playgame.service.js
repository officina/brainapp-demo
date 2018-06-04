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

  //IE non supporta i dizionari, soluzione trovata online https://stackoverflow.com/questions/42830257/alternative-version-for-object-values/42830295
  this.values = function (obj) {
      if (typeof Object.values === 'function'){
          return Object.values(obj);
      } else {
          var arrayValues = Object.keys(obj).map(function(itm) { return obj[itm]; });
          return arrayValues
      }

  };
    //GET GAME
  this.getGame =  function getGame(gameId, userid, token, sessionid){
      return $http({
      	method: 'GET',
      	url: rootPath + '/api/games/' + gameId +  '?userid='+userid+'&playtoken='+token
      })
  };

  //GAME AUTH
  this.getGameInit =  function getGame(gameId, userid, sessionid, replay){
      return $http({
      	method: 'GET',
      	url: rootPath + '/api/play/' + gameId +  '/init/' + sessionid + '/' + userid + '?replay=' + replay
      })
  };

    //CREATE MATCH
  this.createMatch = function(gameId, templateId, playerId,token, sessionId, matchToken, replay){
	  return $http({
      	method: 'POST',
      	url: rootPath+'/api/play',
      	data:{
        	gameid:gameId,
        	templateid: templateId,
        	playerid:playerId,
        	playtoken:token,
        	sessionid: sessionId,
        	matchtoken: matchToken,
            replay: replay
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
  this.updateAttemptScore = function(attempt, match, matchtoken){
	  return $http({
      	method: 'PUT',
      	url: rootPath +'/api/v2/play/attempt/score',
      	data: {
      	    attempt:attempt,
            score: attempt.score,
            level: attempt.level,
            match: match,
            matchtoken: matchtoken
        }
	  })
  };
    //CLOSE ATTEMPT
  this.endAttempt = function(gameId, attempt, score, level, completed, endMatch, matchToken, match){
	  return $http({
      	method: 'PUT',
      	url: rootPath +'/api/play/attempt/end',
      	data:{
        	gameid:gameId,
      		score:score,
      		level:level,
      		completed:completed,
      		endmatch:endMatch,
      		matchtoken:matchToken,
            match:match,
            attempt:attempt
        }
	  })
  };

  //RESTART ATTEMPT
      this.restartAttemptToServer = function(gameId, attempt, match, matchtoken, sessionid, endmatch){
          return $http({
              method: 'PUT',
              url: rootPath +'/api/play/attempt/restart',
              data:{
                  gameid:gameId,
                  completed:attempt.completed,
                  endmatch:endmatch,
                  matchtoken:matchtoken,
                  match:match,
                  attempt:attempt,
                  sessionid:sessionid
              }
          })
      };

      //END MATCH
    this.endMatch = function(gameId, playerId, token, matchId, attempt, matchToken, attempts, score, level, attemptsOffline){
        attemptsOffline = this.values(attemptsOffline);
      return $http({
        method: 'PUT',
        url: rootPath + '/api/play/end',
        data:{
          gameid:gameId,
          playerid:playerId,
          token:token,
          matchid:matchId,
          attempt:attempt,
          matchtoken: matchToken,
          score:score,
          level:level,
          attempts: attempts,
          attemptsOffline: attemptsOffline
        }
      })
    };

    //SEND REPORT
    this.report = function(matchId, userId, json){
    	var content = {};
    	content.info = json;
    	content.userAgent = navigator.userAgent;
    	var http = new XMLHttpRequest();
      	http.open("POST", '/api/matches/'+matchId+'/report/'+userId, false);
      	http.setRequestHeader("Content-type", "application/json");
      	console.log(JSON.stringify(content));
		http.send(JSON.stringify(content));
    }

    this.reportAsync = function(matchId, userId, json){
    	console.log(json);
    	var internalUserAgent = navigator.userAgent;
  	    return $http({
        	method: 'POST',
        	url: rootPath + '/api/matches/'+matchId+'/report/'+userId,
        	data:{
        		userAgent: internalUserAgent,
        		info: json
	         }
  	    })
    };

  //SEND ERROR
    this.error = function(matchId, userId, json){
    	var content = {};
    	content.info = json;
    	content.userAgent = navigator.userAgent;
    	var http = new XMLHttpRequest();
      	http.open("POST", '/api/matches/'+matchId+'/error/'+userId, false);
      	http.setRequestHeader("Content-type", "application/json");
		http.send(JSON.stringify(content));
    }

    this.errorAsync = function(matchId, userId, json){
    	var internalUserAgent = navigator.userAgent;
  	    return $http({
        	method: 'POST',
        	url: rootPath + '/api/matches/'+matchId+'/error/'+userId,
        	data:{
        		userAgent: internalUserAgent,
        		info: json
	         }
  	    })
    };

    this.syncEndMatch = function(gameId, playerId, token, matchId, attempt, score, level, matchToken, attempts){
        var http = new XMLHttpRequest();
        http.open("PUT", '/api/play/end', false);
        http.setRequestHeader("Content-type", "application/json");
        var dataPut = {};
        dataPut.gameid = gameId;
        dataPut.playerid = playerId;
        dataPut.token = token;
        dataPut.matchid = matchId;
    	dataPut.attempt = attempt;
    	dataPut.score = score;
    	dataPut.level = level;
    	dataPut.matchtoken = matchToken;
    	dataPut.attempts = attempts;
		http.send(JSON.stringify(dataPut));
    }

    this.syncOfflineAttempts = function(attemptsOffline, match){
        attemptsOffline = this.values(attemptsOffline);
        return $http({
            method: 'POST',
            url: rootPath + '/api/attempts/sync',
            data:{
                match: match,
                attemptsOffline: this.values(attemptsOffline)
            }
        })
    }

  }]);
