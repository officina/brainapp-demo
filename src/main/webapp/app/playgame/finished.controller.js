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
    	$scope.showError = false;
    	$scope.showReport = false;
    	
    	switch($stateParams.why)
    	{
    		case 'invalidSession':
    			$scope.message1 = 'Nessuna sessione di gioco attiva.';
    	    	$scope.message2 = 'Grazie per aver giocato!';
    			break;
    		case 'timeout':
    			$scope.message1 = 'La tua partita è terminata. ';
    	    	$scope.message2 = 'Grazie per aver giocato!';
    			break
    		case 'invalidMatch':
    			$scope.message1 = 'La tua partita è stata invalidata. ';
    	    	$scope.message2 = 'Grazie per aver giocato!';
    			break
    		case 'genericError':
    			$scope.message1 = 'Si è verificato un errore imprevisto. ';
    	    	$scope.message2 = 'Ti preghiamo di segnalare la cosa all\'amministratore del sistema.';
    	    	$scope.errorText = $rootScope.finalError;
    	    	$scope.reportText = $rootScope.wrapperMemory;
    	    	var idToUse = -1
    	    	if (typeof $rootScope.wrapperMemory != 'undefined' && typeof $rootScope.wrapperMemory.match != 'undefined' && typeof $rootScope.wrapperMemory.match.id != 'undefined')
    	    	{
    	    		idToUse = $rootScope.wrapperMemory.match.id;
    	    	}
    	    	PlaygameService.reportAsync(idToUse,$stateParams.playtoken,$rootScope.wrapperMemory)
    	    	.then(function(response){
    	    		PlaygameService.errorAsync(idToUse,$stateParams.playtoken,$scope.errorText);
		    	})
		    	.catch(function(error) {
		    		$scope.showReport = true;
		    		$scope.showError = true;
		    		$scope.message2 = 'Ti preghiamo di inviare l\'errore che trovi in calce all\'amministratore del sistema.';
		    		//anche se fallita la prima provo comunque l'invio di error
		    		PlaygameService.errorAsync(idToUse,$stateParams.playtoken,$scope.errorText);
		    	});
    			break
    	}
    }
})();
