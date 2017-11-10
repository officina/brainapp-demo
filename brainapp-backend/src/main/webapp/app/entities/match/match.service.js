(function() {
    'use strict';
    angular
        .module('brainappbackendApp')
        .factory('Match', Match);

    Match.$inject = ['$resource', 'DateUtils'];

    function Match ($resource, DateUtils) {
        var resourceUrl =  'api/matches/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.start = DateUtils.convertDateTimeFromServer(data.start);
                        data.stop = DateUtils.convertDateTimeFromServer(data.stop);
                        data.lastStart = DateUtils.convertDateTimeFromServer(data.lastStart);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
