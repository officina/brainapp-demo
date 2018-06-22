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

    	var sendProblem = function(){
    		$scope.errorText = $rootScope.finalError;
	    	$scope.reportText = $rootScope.wrapperMemory;
    		var idToUse = -1
	    	if (typeof $rootScope.wrapperMemory != 'undefined' && typeof $rootScope.wrapperMemory.match != 'undefined' && typeof $rootScope.wrapperMemory.match.id != 'undefined')
	    	{
	    		idToUse = $rootScope.wrapperMemory.match.id;
	    	}
	    	//invio il report di giocata
	    	PlaygameService.reportAsync(idToUse,$stateParams.playtoken,$rootScope.wrapperMemory)
	    	.then(function(response){
	    		//se l'invio di report giocata va a buon fine invio anche l'errore che mi ha portato a questo genericError
	    		// all'utente mostro il log di errore solo nel caso in cui fallisca l'invio di error
	    		PlaygameService.errorAsync(idToUse,$stateParams.playtoken,$scope.errorText)
	    		.catch(function(error) {
		    		$scope.showReport = true;
		    		$scope.showError = true;
		    		$scope.message2 = 'Ti preghiamo di inviare l\'errore che trovi in calce a energy4brain@generali.com';
		    	});
	    	})
	    	.catch(function(error) {
	    		//se fallisce l'invio del report provo l'invio dell'errore
	    		//solo in questo caso mostro all'utente i messaggi da inviare all'amministratore
	    		$scope.showReport = true;
	    		$scope.showError = true;
	    		$scope.message2 = 'Ti preghiamo di inviare l\'errore che trovi in calce a energy4brain@generali.com';
	    		//anche se fallita la prima provo comunque l'invio dell'errore
	    		PlaygameService.errorAsync(idToUse,$stateParams.playtoken,$scope.errorText);
	    	});
    	}

        var score = 0;
    	if ($rootScope.wrapperMemory.match && $rootScope.wrapperMemory.match.game){
            if ($rootScope.wrapperMemory.match.game.type === 'LEVEL'){
                score = $rootScope.wrapperMemory.match.bestLevel;
            }else{
                score = $rootScope.wrapperMemory.match.bestScore;
            }
        }
    	switch($stateParams.why)
    	{

            case 'cloneSuccessfully':
                $scope.message1 = 'La tua ultima giocata è stata salvata con successo';
                $scope.message2 = 'Il punteggio riportato per '+$rootScope.wrapperMemory.match.game.description+' è '+score;
                break;
    		case 'invalidSession':
    			$scope.message1 = 'Nessuna sessione di gioco attiva.';
    	    	$scope.message2 = 'Ti preghiamo di segnalare la cosa a energy4brain@generali.com';
    			break;
            case 'invalidSitecore':
                $scope.message1 = 'Nessuna sessione di gioco attiva.';
                $scope.message2 = 'Le verifiche di autenticazione sulla sessione corrente hanno dato esito negativo';
                break;
    		case 'timeout':
    			$scope.message1 = 'La tua partita è terminata.';
    	    	$scope.message2 = 'Grazie per aver giocato! Il punteggio riportato per '+$rootScope.wrapperMemory.match.game.description+' è '+score;
    			break;
    			//matchInvalid è riferito al caso in cui l'amministratore ha invalidato la giocata dalla dashboard, è diverso da invalidMatch
            case 'matchInvalid':
                $scope.message1 = 'La tua partita è stata terminata.';
                $scope.message2 = 'Ti preghiamo di contattare energy4brain@generali.com';
                break;
            case 'matchElaborated':
                $scope.message1 = 'La tua partita è stata elaborata.';
                $scope.message2 = 'Grazie per aver giocato!';
                break;
            case 'matchEnded':
                $scope.message1 = 'La tua partita è terminata.';
                $scope.message2 = 'Grazie per aver giocato!';
                break;
            case 'matchAnomalous':
                $scope.message1 = 'La tua partita è terminata.';
                $scope.message2 = 'Grazie per aver giocato!';
                break;
            case 'sessionAlreadyInUse':
                $scope.message1 = 'La tua partita è in corso';
                $scope.message2 = 'Hai un\'altra giocata in corso';
                break;
            case 'offline':
                $scope.message1 = 'Non siamo riusciti a contattare il server';
                $scope.message2 = 'Verifica la connessione';
                break;
                //identifica i match resi "problematici" a causa di bug, o errori da parte dell'utente
    		case 'invalidMatch':
    			$scope.message1 = 'La tua partita è stata invalidata. ';
    	    	$scope.message2 = 'Ti preghiamo di segnalare la cosa a energy4brain@generali.com';
    	    	sendProblem();
    			break;
    		case 'genericError':
    			$scope.message1 = 'Si è verificato un errore imprevisto. ';
    	    	$scope.message2 = 'Ti preghiamo di segnalare la cosa a energy4brain@generali.com';
    	    	sendProblem();
    			break;
    	}
    }
})();
