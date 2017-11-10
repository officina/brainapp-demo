(function() {
    'use strict';

    angular
        .module('brainappbackendApp')
        .controller('SessionDeleteController',SessionDeleteController);

    SessionDeleteController.$inject = ['$uibModalInstance', 'entity', 'Session'];

    function SessionDeleteController($uibModalInstance, entity, Session) {
        var vm = this;

        vm.session = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Session.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
