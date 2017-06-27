(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('match-template', {
            parent: 'entity',
            url: '/match-template?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatoradeApp.matchTemplate.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/match-template/match-templates.html',
                    controller: 'MatchTemplateController',
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
                    $translatePartialLoader.addPart('matchTemplate');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('match-template-detail', {
            parent: 'match-template',
            url: '/match-template/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gatoradeApp.matchTemplate.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/match-template/match-template-detail.html',
                    controller: 'MatchTemplateDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('matchTemplate');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'MatchTemplate', function($stateParams, MatchTemplate) {
                    return MatchTemplate.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'match-template',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('match-template-detail.edit', {
            parent: 'match-template-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/match-template/match-template-dialog.html',
                    controller: 'MatchTemplateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MatchTemplate', function(MatchTemplate) {
                            return MatchTemplate.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('match-template.new', {
            parent: 'match-template',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/match-template/match-template-dialog.html',
                    controller: 'MatchTemplateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                maxDuration: null,
                                maxAttempt: null,
                                description: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('match-template', null, { reload: 'match-template' });
                }, function() {
                    $state.go('match-template');
                });
            }]
        })
        .state('match-template.edit', {
            parent: 'match-template',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/match-template/match-template-dialog.html',
                    controller: 'MatchTemplateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['MatchTemplate', function(MatchTemplate) {
                            return MatchTemplate.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('match-template', null, { reload: 'match-template' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('match-template.delete', {
            parent: 'match-template',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/match-template/match-template-delete-dialog.html',
                    controller: 'MatchTemplateDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['MatchTemplate', function(MatchTemplate) {
                            return MatchTemplate.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('match-template', null, { reload: 'match-template' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
