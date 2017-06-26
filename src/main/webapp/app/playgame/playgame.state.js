(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('play', {
            parent: 'app',
            url: '/play',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/playgame/playgame.html',
                    controller: 'PlaygameController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('play');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
