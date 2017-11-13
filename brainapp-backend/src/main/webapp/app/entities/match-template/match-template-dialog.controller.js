(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .controller('MatchTemplateDialogController', MatchTemplateDialogController);

    MatchTemplateDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'MatchTemplate', 'Game'];

    function MatchTemplateDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, MatchTemplate, Game) {
        var vm = this;

        vm.matchTemplate = entity;
        vm.clear = clear;
        vm.save = save;
        vm.games = Game.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.matchTemplate.id !== null) {
                MatchTemplate.update(vm.matchTemplate, onSaveSuccess, onSaveError);
            } else {
                MatchTemplate.save(vm.matchTemplate, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('brainappbackendApp:matchTemplateUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
