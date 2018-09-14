(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('MatchDialogController', MatchDialogController);

    MatchDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Match', 'Game', 'MatchTemplate', 'Attempt', 'Session'];

    function MatchDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Match, Game, MatchTemplate, Attempt, Session) {
        var vm = this;

        vm.match = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.games = Game.query();
        vm.matchtemplates = MatchTemplate.query();
        vm.attempts = Attempt.query();
        vm.sessions = Session.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.match.id !== null) {
                Match.update(vm.match, onSaveSuccess, onSaveError);
            } else {
                Match.save(vm.match, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('gatoradeApp:matchUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.start = false;
        vm.datePickerOpenStatus.stop = false;
        vm.datePickerOpenStatus.lastStart = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
