(function() {
    'use strict';
    angular
        .module('brainappbackendApp')
        .factory('Attempt', Attempt);

    Attempt.$inject = ['$resource', 'DateUtils'];

    function Attempt ($resource, DateUtils) {
        var resourceUrl =  'api/attempts/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.startAttempt = DateUtils.convertDateTimeFromServer(data.startAttempt);
                        data.stopAttempt = DateUtils.convertDateTimeFromServer(data.stopAttempt);
                        data.lastUpdate = DateUtils.convertDateTimeFromServer(data.lastUpdate);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
