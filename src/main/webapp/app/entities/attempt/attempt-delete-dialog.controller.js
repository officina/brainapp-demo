(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('AttemptDeleteController',AttemptDeleteController);

    AttemptDeleteController.$inject = ['$uibModalInstance', 'entity', 'Attempt'];

    function AttemptDeleteController($uibModalInstance, entity, Attempt) {
        var vm = this;

        vm.attempt = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Attempt.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
