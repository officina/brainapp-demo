'use strict';

/**
 * @ngdoc function
 * @name desktopApp.controller:PlaygameCtrl
 * @description
 * # PlaygameCtrl
 * Controller of the desktopApp
 */
angular.module('desktopApp')
  .controller('PlaygameCtrl', function ($scope, $sce) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.game = {

      id:"gameId",
      url:$sce.trustAsResourceUrl("https://0.s3.envato.com/files/225182752/index.html")

    }
  });
