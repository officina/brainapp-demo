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
                authorities: ['ROLE_ADMIN'],
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
        .state('manage.reset', {
            parent: 'manage',
            url: '/{id}/reset',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/dashboard/popup.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Match', function(Match) {
                            return Match.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    console.log('akelelelumama');
                    }, function() {
                    console.log('no')
                });
            }]
        })
        .state('manage.close', {
            parent: 'manage',
            url: '/{id}/close',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/dashboard/popup.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg'
                }).result.then(function() {
                    $state.go('manage', null, { reload: 'manage' });
                }, function() {
                    $state.go('manage');
                });
            }]
        })
        .state('manage.elaborate', {
            parent: 'manage',
            url: '/{id}/elaborate',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/dashboard/popup.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    // resolve: {
                    //     entity: function () {
                    //         return {
                    //             description: null,
                    //             url: null,
                    //             code: null,
                    //             actionId: null,
                    //             type: null,
                    //             useLevels: null,
                    //             levelsNumber: null,
                    //             lastAttemptValid: null,
                    //             defaultScore: null,
                    //             id: null
                    //         };
                    //     }
                    // }
                }).result.then(function() {
                    $state.go('manage', null, { reload: 'manage' });
                }, function() {
                    $state.go('manage');
                });
            }]
        })
    }
})();
