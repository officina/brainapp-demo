'use strict';

angular.module('gatoradeApp')
    .service('DashboardService', ['$http',function ($http) {
    var rootPath = '';
    this.getSession = function getSession(sessionid) {
        return $http({
            method: 'GET',
            url: rootPath + '/api/sessions/sessionid'
        })
    };
    }]);
