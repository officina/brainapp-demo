'use strict';

/**
 * @ngdoc service
 * @name desktopApp.GameService
 * @description
 * # GameService
 * Service in the desktopApp.
 */
angular.module('desktopApp')
  .service('GameService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //noinspection JSAnnotator
    this.getGame =  function getGame(gameId, playerId, token){

      console.log("calling http service")
      $http.get('/api/playgame/1051/playerid/3/playtoken/asd8sd')
    }
  });
