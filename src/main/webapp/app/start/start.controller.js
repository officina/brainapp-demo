(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('HomeController', StartController);

    StartController.$inject = ['$scope', '$state'];

    function StartController ($scope,  $state) {

    }
})();
