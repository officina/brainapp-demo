(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('MatchDeleteController',MatchDeleteController);

    MatchDeleteController.$inject = ['$uibModalInstance', 'entity', 'Match'];

    function MatchDeleteController($uibModalInstance, entity, Match) {
        var vm = this;

        vm.match = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Match.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
