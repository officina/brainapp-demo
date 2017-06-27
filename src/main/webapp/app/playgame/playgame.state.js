(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('play', {
            parent: 'app',
            url: '/play/gameId/:gameId/playtoken/:playtoken',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/playgame/playgame.html',
                    controller: 'PlaygameController',
                    controllerAs: 'vm'
                },
                'navbar@': {
                    templateUrl: 'app/layouts/navbar/navbar2.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
