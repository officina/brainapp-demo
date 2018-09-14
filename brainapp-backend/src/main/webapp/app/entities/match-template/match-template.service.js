(function() {
    'use strict';
    angular
        .module('gatoradeApp')
        .factory('MatchTemplate', MatchTemplate);

    MatchTemplate.$inject = ['$resource'];

    function MatchTemplate ($resource) {
        var resourceUrl =  'api/match-templates/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
