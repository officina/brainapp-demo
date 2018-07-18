(function() {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameControllerFinished', PlaygameControllerFinished);

    PlaygameControllerFinished.$inject = ['$scope', '$rootScope' ,'Principal', 'LoginService', '$state', 'PlaygameService','$sce', '$stateParams'];

    function PlaygameControllerFinished($scope, $rootScope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams) {
    	console.log('Finished controller!!');
    	//remove confirm message
    	$(window).unbind('beforeunload');
    	$(window).unbind('unload');

    	$scope.message1 = 'Gioco finito o sessione terminata. ';
    	$scope.message2 = 'Grazie per aver giocato!';
    	$scope.showError = false;
    	$scope.showReport = false;
        $scope.showReinizia = false;
        $scope.showConcludi = false;

    	var sendProblem = function(){
    		$scope.errorText = $rootScope.finalError;
	    	$scope.reportText = $rootScope.wrapperMemory;
    		var idToUse = -1;
	    	if (typeof $rootScope.wrapperMemory != 'undefined' && typeof $rootScope.wrapperMemory.match != 'undefined' && typeof $rootScope.wrapperMemory.match.id != 'undefined')
	    	{
	    		idToUse = $rootScope.wrapperMemory.match.id;
	    	}
	    	//invio il report di giocata
            var mailWithBody = $sce.trustAsHtml("Ti preghiamo di inviare le informazioni che trovi in calce a  <a href=\"mailto:energy4brain@generali.com?body=\=\=\=\=\nNON MODIFICARE \=\=\=\=\n\n"+$rootScope.wrapperMemory+"\n\n"+$rootScope.finalError+"\">energy4brain@generali.com</a>");
	    	PlaygameService.reportAsync(idToUse,$stateParams.playtoken,$rootScope.wrapperMemory)
	    	.then(function(response){
	    		//se l'invio di report giocata va a buon fine invio anche l'errore che mi ha portato a questo genericError
	    		// all'utente mostro il log di errore solo nel caso in cui fallisca l'invio di error
	    		PlaygameService.errorAsync(idToUse,$stateParams.playtoken,$scope.errorText)
	    		.catch(function(error) {
		    		$scope.showReport = true;
		    		$scope.showError = true;
                    if (error.status !== 400){
                        $scope.message2 = mailWithBody;
                    }
		    	});
	    	})
	    	.catch(function(error) {
	    		//se fallisce l'invio del report provo l'invio dell'errore
	    		//solo in questo caso mostro all'utente i messaggi da inviare all'amministratore
	    		$scope.showReport = true;
	    		$scope.showError = true;
	    		if (error.status !== 400){
                    $scope.message2 = mailWithBody;
                }
	    		//anche se fallita la prima provo comunque l'invio dell'errore
	    		PlaygameService.errorAsync(idToUse,$stateParams.playtoken,$scope.errorText);
	    	});
    	};
    	var subject = "Player "+$stateParams.playtoken+" sessione "+$stateParams.sessionid;
        var mailTo = $sce.trustAsHtml("<a href=\"mailto:energy4brain@generali.com?subject="+subject+"\">energy4brain@generali.com</a>")
        var score = 0;
        var descr = '...';
    	if ($rootScope.wrapperMemory !== undefined && $rootScope.wrapperMemory.match !== undefined && $rootScope.wrapperMemory.match.game !== undefined){
    	    descr = $rootScope.wrapperMemory.match.game.description;
            if ($rootScope.wrapperMemory.match.game.type === 'LEVEL'){
                if ($rootScope.wrapperMemory.match.bestLevel){
                    score = $rootScope.wrapperMemory.match.bestLevel;
                }
            }else{
                if ($rootScope.wrapperMemory.match.bestScore) {
                    score = $rootScope.wrapperMemory.match.bestScore;
                }
            }
        }
        switch($stateParams.why)
        {
            case 'cloneSuccessfully':
                $scope.message1 = 'La tua ultima giocata è stata salvata con successo';
                $scope.message2 = 'Grazie per aver giocato! Il risultato raggiunto per '+descr+' è '+score;
                break;
            case 'invalidSession':
                $scope.message1 = 'Sessione non attivabile';
                $scope.message2 = $sce.trustAsHtml('La sessione di gioco non risulta associata al team di riferimento.\n' +
                    'Ti preghiamo di segnalare la cosa a '+mailTo);
                sendProblem();
                break;
            case 'invalidSitecore':
                $scope.message1 = 'Nessuna sessione di gioco attiva.';
                $scope.message2 = $sce.trustAsHtml('Le verifiche di autenticazione sulla sessione corrente hanno dato esito negativo. Ti preghiamo di segnalare la cosa a '+mailTo);
                sendProblem();
                break;
            case 'timeout':
                $scope.message1 = 'Tempo scaduto! La tua partita è terminata.';
                $scope.message2 = 'Grazie per aver giocato! Il risultato riportato per '+descr+' è '+score;
                if ($rootScope.wrapperMemory !== undefined && $rootScope.wrapperMemory.match.restartable){
                    $scope.showReinizia = true;
                    $scope.showConcludi = false;
                    $scope.message2 = $scope.message2 + $sce.trustAsHtml('<br>Hai giocato meno del 50% del tempo che avevi a disposizione.</br>' +
                        '</br>' +
                        'Seleziona "REINIZIA" per annullare e rieffettuare la giocata')
                }
                break;
            //matchInvalid è riferito al caso in cui l'amministratore ha invalidato la giocata dalla dashboard, è diverso da invalidMatch
            case 'matchInvalid':
                $scope.message1 = 'La tua partita è stata annullata.';
                $scope.message2 = $sce.trustAsHtml('La tua giocata è stata annullata ed hai la possibilità di rifarla.</br>Puoi contattare '+mailTo+' per eventuali chiarimenti');
                sendProblem();
                break;
            case 'matchElaborated':
                $scope.message1 = 'La tua partita è stata elaborata.';
                $scope.message2 = $sce.trustAsHtml('Grazie per aver giocato!</br>La tua giocata risulta già effettuata.</br>Le classifiche sono state aggiornate');
                sendProblem();
                break;
            case 'failToSend':
                $scope.message1 = 'Partita conclusa, invio risultato a classifica fallito.';
                $scope.message2 = $sce.trustAsHtml('Si sono verificati dei problemi nella fase di aggiornamento delle le classifiche! Ti preghiamo di segnalare l\'accaduto a '+mailTo);
                sendProblem();
                break;
            case 'sendingData':
                $scope.message1 = 'Partita conclusa, aggiornamento classifiche in corso.';
                $scope.message2 = $sce.trustAsHtml('Le classifiche sono in corso di aggiornamento</br>' +
                    'Se le classifiche non dovessero essere corretamente aggiornate, ti preghiamo di segnalare l\'accaduto a ')+mailTo;
                sendProblem();
                break;
            case 'matchEnded':
                $scope.message1 = 'La tua partita è terminata.';
                $scope.message2 = $sce.trustAsHtml('Grazie per aver giocato!</br>' +
                    'La tua giocata risulta già effettuata; le classifiche sono in corso di aggiornamento');
                break;
            case 'matchAnomalous':
                $scope.message1 = 'La tua partita è terminata.';
                $scope.message2 = $sce.trustAsHtml('Grazie per aver giocato!</br>' +
                    'La tua giocate si è interrotta anticipatamente.');
                sendProblem();
                break;
            case 'sessionAlreadyInUse':
                $scope.message1 = 'La tua partita è in corso';
                $scope.message2 = $sce.trustAsHtml('Se desideri prendere il controllo da questsa scheda e rieffettuare la giocata da capo, trascurando l\'altra giocata in corso, seleziona</br>' +
                    ' "REINIZIA" </br>' +
                    'Selezionando "REINIZIA" il risultato già raggiunto verrà sostituito');
                $scope.showReinizia = true;
                $scope.showConcludi = false;
                break;
            case 'offline':
                $scope.message1 = 'Non siamo riusciti a contattare il server';
                $scope.message2 = 'Verifica la connessione';
                break;
            case 'missingSession':
                $scope.message1 = 'Sessione non disponibile';
                $scope.message2 = $sce.trustAsHtml('La sessione richiesta è inesistente, non attiva o terminata.</br>' +
                    'Puoi contattare '+mailTo+' per eventuali chiarimenti');
                break;
            //identifica i match resi "problematici" a causa di bug, o errori da parte dell'utente
            case 'invalidMatch':
                $scope.message1 = 'La tua partita è stata invalidata. ';
                $scope.message2 = $sce.trustAsHtml('Ti preghiamo di segnalare la cosa a ' +mailTo);
                sendProblem();
                break;
            case 'genericError':
                $scope.message1 = 'Si è verificato un errore imprevisto. ';
                $scope.message2 = $sce.trustAsHtml('Ti preghiamo di segnalare la cosa a ' +mailTo);
                sendProblem();
                break;
            case 'matchAnomalousRestartable':
                $scope.showReinizia = true;
                $scope.showConcludi = true;
                $scope.message1 = 'La tua partita è terminata.';
                $scope.message2 = $scope.message2 + $sce.trustAsHtml('<br>Seleziona "COMPLETA" per approvare la giocata ed aggiornare le classifiche di conseguenza o "REINIZIA" per annullare e rieffettuare la giocata');
                break;
        }

        $scope.resetMatch = function () {
            PlaygameService.resetPendingMatch($stateParams.sessionid, $stateParams.playtoken)
                .then(function(response){
                    $state.go("play", {
                        "gameid": $stateParams.gameid,
                        "playtoken": $stateParams.playtoken,
                        "sessionid": $stateParams.sessionid,
                        "bp": $rootScope.wrapperMemory.bp,
                        "replay": $rootScope.wrapperMemory.replay
                    });
                })
                .catch(function(error) {
                    $scope.message1 = 'Si è verificato un errore imprevisto.';
                    $scope.message2 = mailTo;
                    sendProblem();
                });
        };

        $scope.completePendingMatch = function () {
            PlaygameService.completePendingMatch($stateParams.sessionid, $stateParams.playtoken)
                .then(function(response){
                    $scope.message1 = 'La tua partita è stata elaborata.';
                    $scope.message2 = $sce.trustAsHtml('Grazie per aver giocato!</br>La tua giocata risulta già effettuata.</br>Le classifiche sono state aggiornate');
                    $scope.showReinizia = false;
                    $scope.showConcludi = false;
                    sendProblem();
                })
                .catch(function(error) {
                    $scope.message1 = 'Si è verificato un errore imprevisto.';
                    $scope.message2 = $sce.trustAsHtml('Ti preghiamo di segnalare la cosa a ' +mailTo);
                    $scope.showReinizia = false;
                    $scope.showConcludi = false;
                    sendProblem();
                });
        };
    }
})();
