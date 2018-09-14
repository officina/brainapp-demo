(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('StartController', StartController);

    StartController.$inject = ['$scope', '$state'];

    function StartController ($scope,  $state) {
        $scope.title = "Stiamo preparando dei giochi molto interessanti."
        $scope.subtitle = "Ma non dovresti stare qui :)"
    }
})();
