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
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.game = GameService.getGame(1051, 13, "asd")


  });
