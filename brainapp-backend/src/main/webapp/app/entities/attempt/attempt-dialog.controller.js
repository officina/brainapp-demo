(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .controller('AttemptDialogController', AttemptDialogController);

    AttemptDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Attempt', 'Match'];

    function AttemptDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Attempt, Match) {
        var vm = this;

        vm.attempt = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.matches = Match.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.attempt.id !== null) {
                Attempt.update(vm.attempt, onSaveSuccess, onSaveError);
            } else {
                Attempt.save(vm.attempt, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('brainappbackendApp:attemptUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.startAttempt = false;
        vm.datePickerOpenStatus.stopAttempt = false;
        vm.datePickerOpenStatus.lastUpdate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
