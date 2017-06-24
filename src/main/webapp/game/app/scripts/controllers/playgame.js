'use strict';

/**
 * @ngdoc function
 * @name desktopApp.controller:PlaygameCtrl
 * @description
 * # PlaygameCtrl
 * Controller of the desktopApp
 */
angular.module('desktopApp')
  .controller('PlaygameCtrl', function ($scope, $sce, GameService) {


    // IE + others compatible event handler
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
      console.log('game ended with:  ', e.data)
      console.log("game ended! with " + e.data.gameEnd.endPoints + " points")
      GameService.updateScore(1101,2,234,45)
    },false);


    $scope.game = {}

    var updateScoreWithValue = function(value){
      GameService.updateScore(1101,2,234,45)
    }

    $scope.game.gameEndedWithValue = function(value){
      GameService.endGame(1101,2,234,45)
    }

    GameService.getGame(1051, 13, "asd").then(function(response){
      var game = response.data
      game.url = $sce.trustAsResourceUrl(response.data.url)
      $scope.game = game


    })
  });
