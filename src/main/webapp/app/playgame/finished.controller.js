(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameControllerFinished', PlaygameControllerFinished);

    PlaygameControllerFinished.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'PlaygameService','$sce', '$stateParams'];

    function PlaygameControllerFinished($scope, $rootScope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams,timer) {
    	console.log('Finished controller!!');
    	//remove confirm message
    	$(window).unbind('beforeunload');
    	$(window).unbind('unload');
    	
    	$scope.message1 = 'Gioco finito o sessione terminata. ';
    	$scope.message2 = 'Grazie per aver giocato!';
    	
    	switch($stateParams.why)
    	{
    		case 'invalidSession':
    			$scope.message1 = 'Nessuna sessione di gioco attiva.';
    	    	$scope.message2 = 'Riprova più tardi!';
    			break;
    		case 'timeout':
    			$scope.message1 = 'La tua partita è terminata. ';
    	    	$scope.message2 = 'Grazie per aver giocato!';
    			break
    		case 'invalidMatch':
    			$scope.message1 = 'La tua partita è stata invalidata. ';
    	    	$scope.message2 = 'Non fare il furbo :-)';
    			break
    	}
    }
})();
