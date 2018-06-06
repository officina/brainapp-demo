(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('play', {
            parent: 'app',
            url: '/play/gameid/:gameid/playtoken/:playtoken/sessionid/:sessionid/replay/:replay',
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
        }).state('ended', {
            parent: 'app',
            url: '/finished/gameid/:gameid/playtoken/:playtoken/sessionid/:sessionid?:why',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/playgame/game_finished.html',
                    controller: 'PlaygameControllerFinished',
                    controllerAs: 'vm'
                },
                'navbar@': {
                    templateUrl: 'app/layouts/navbar/navbar3.html',
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
        });;
    }
})();
