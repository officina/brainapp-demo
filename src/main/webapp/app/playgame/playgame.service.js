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
    this.getGame =  function getGame(gameId, playerId, token){

      console.log("calling http service")
      //$http.get('http://localhost:8080/api/playgame?gameId=1051&playerId=1&playtoken=asdad')
      return $http({
        method: 'GET',
        url: '/api/play?gameId=' + gameId +  '&playerId=1&playtoken='+token
      })


    }

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
