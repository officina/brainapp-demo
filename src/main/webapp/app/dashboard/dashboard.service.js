'use strict';

angular.module('gatoradeApp')
    .service('DashboardService', ['$http',function ($http) {
    var rootPath = '';
    //Gets Session Info
    this.getSession = function getSession(sessionid) {
        return $http({
            method: 'GET',
            url: rootPath + '/api/sessions/' + sessionid,
        })
    };

    //Gets Matches Info
    this.getMatches = function getMatches(sessionid) {
        return $http({
            method: 'GET',
            url: rootPath + '/api/matches/by-session/' + sessionid
        })
    };


    }]);
