(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('manage', {
            parent: 'app',
            url: '/manage/sessionid/:extsessionid',
            data: {
                authorities: ['ROLE_GENERALI']
            },
            views: {
                'content@': {
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                },
                'navbar@': {
                    templateUrl: 'app/layouts/navbar/navbardashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        })
    }
})();
