(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('MatchTemplateDeleteController',MatchTemplateDeleteController);

    MatchTemplateDeleteController.$inject = ['$uibModalInstance', 'entity', 'MatchTemplate'];

    function MatchTemplateDeleteController($uibModalInstance, entity, MatchTemplate) {
        var vm = this;

        vm.matchTemplate = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            MatchTemplate.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
