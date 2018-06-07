'use strict';

angular.module('gatoradeApp')

    .service('DashboardService', ['$http',function ($http) {
        var rootPath = '';
        //Gets Session Info
        this.getSession = function getSession(sessionid) {
            return $http({
                method: 'GET',
                url: rootPath + '/api/sessions/' + sessionid
            })
        };

        //Gets Matches Info
        this.getMatches = function getMatches(sessionid) {
            return $http({
                method: 'GET',
                url: rootPath + '/api/matches/by-session/' + sessionid
            })
        };

        this.resetMatch = function(matchid){
            return $http({
                method: 'PUT',
                url: rootPath + '/api/matches/'+matchid+'/reset'
            })
        };

        this.elaborateMatch = function(matchid){
            return $http({
                method: 'PUT',
                url: rootPath + '/api/matches/'+matchid+'/admin/elaborate'
            })
        };

        this.closeMatch = function(matchid){
            return $http({
                method: 'PUT',
                url: rootPath + '/api/matches/'+matchid+'/admin/close'
            })
        };


    }]);
