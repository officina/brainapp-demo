(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .controller('SessionDialogController', SessionDialogController);

    SessionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Session', 'Match', 'Game'];

    function SessionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Session, Match, Game) {
        var vm = this;

        vm.session = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.matches = Match.query();
        vm.games = Game.query({filter: 'session-is-null'});
        $q.all([vm.session.$promise, vm.games.$promise]).then(function() {
            if (!vm.session.game || !vm.session.game.id) {
                return $q.reject();
            }
            return Game.get({id : vm.session.game.id}).$promise;
        }).then(function(game) {
            vm.games.push(game);
        });

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.session.id !== null) {
                Session.update(vm.session, onSaveSuccess, onSaveError);
            } else {
                Session.save(vm.session, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('brainappbackendApp:sessionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.startDate = false;
        vm.datePickerOpenStatus.endDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
