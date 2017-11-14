(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('attempt', {
            parent: 'entity',
            url: '/attempt?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'brainappbackendApp.attempt.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/attempt/attempts.html',
                    controller: 'AttemptController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('attempt');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('attempt-detail', {
            parent: 'attempt',
            url: '/attempt/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'brainappbackendApp.attempt.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/attempt/attempt-detail.html',
                    controller: 'AttemptDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('attempt');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Attempt', function($stateParams, Attempt) {
                    return Attempt.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'attempt',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('attempt-detail.edit', {
            parent: 'attempt-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attempt/attempt-dialog.html',
                    controller: 'AttemptDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Attempt', function(Attempt) {
                            return Attempt.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('attempt.new', {
            parent: 'attempt',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attempt/attempt-dialog.html',
                    controller: 'AttemptDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                attemptScore: null,
                                startAttempt: null,
                                stopAttempt: null,
                                levelReached: null,
                                lastUpdate: null,
                                cancelled: null,
                                completed: null,
                                valid: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('attempt', null, { reload: 'attempt' });
                }, function() {
                    $state.go('attempt');
                });
            }]
        })
        .state('attempt.edit', {
            parent: 'attempt',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attempt/attempt-dialog.html',
                    controller: 'AttemptDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Attempt', function(Attempt) {
                            return Attempt.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('attempt', null, { reload: 'attempt' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('attempt.delete', {
            parent: 'attempt',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attempt/attempt-delete-dialog.html',
                    controller: 'AttemptDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Attempt', function(Attempt) {
                            return Attempt.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('attempt', null, { reload: 'attempt' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
