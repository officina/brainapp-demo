(function () {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameController', PlaygameController);

    PlaygameController.$inject = ['$scope', '$rootScope', 'Principal', 'LoginService', '$state', 'PlaygameService', '$sce', '$stateParams', '$interval'];

    function PlaygameController($scope, $rootScope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams, timer, $interval) {
        $scope.isOnline = true;
        $scope.progressBar = 100;
        $scope.reloadRoute = function() {
            $state.reload();
        };
        var failedToStopAttempt = false;
        Offline.on("up", function () {
            $scope.isOnline = true;
            console.log("Sending offline attempts for sync: ");
            console.log($scope.wrapperMemory.attemptsOffline);
            PlaygameService.syncOfflineAttempts($scope.wrapperMemory.attemptsOffline, $scope.wrapperMemory.match).then(function(response){
                $scope.wrapperMemory.attemptsOffline = {}
            })
            .catch(function (error){
                    console.log('Offline attempts sync failed: ');
                    console.log(error);
                })
        });
        Offline.on("down", function () {
            $scope.isOnline = false;
        });
        $scope.wrapperMemory = {};
        $scope.wrapperMemory.attempts = [];
        $scope.wrapperMemory.attemptsOffline = {};
        $scope.timerOn = true;
        $scope.updateCount = 0;
        $scope.lastProgress = 101;
        $scope.matchToken = Date.now();
        $scope.timerEndTimestamp = -1;
        $scope.timeSpent = 0;
        $scope.showGame = true;
        $scope.showReport = false;
        $scope.showError = false;
        // IE + others compatible event handler
        var offlineOnFirstAttempt = true;
        var addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
        var addEvent = window[addEventMethod];
        var removeEvent = window[removeEventMethod];
        var gameId = $stateParams.gameid;
        var playtoken = $stateParams.playtoken;
        var eventName = addEventMethod === "attachEvent" ? "onmessage" : "message";
        var useLevels = false;

        var setupOffline = function (showReport, offline) {
            $scope.showGame = false;
            if (offline){
                $scope.message1 = "Si è verificato un problema con la tua connessione";
                $scope.message2 = "Ti preghiamo di controllare la tua connessione e rieffettuare la giocata";
            }else{
                $scope.message1 = 'La tua richiesta non è andata a buon fine.';
                $scope.message2 = $sce.trustAsHtml("Prova a ricaricare la pagina, se il problema persiste ti preghiamo di segnalare la cosa a <a href=\"mailto:energy4brain@generali.com\">energy4brain@generali.com</a>");
            }
            if (showReport){
                //non mostro errore in calce perchè lo imposto nella mail
                $scope.showReport = false;
                $scope.showError = false;
                var wrapper = JSON.stringify($rootScope.wrapperMemory);
                var error = JSON.stringify($rootScope.finalError);
                $scope.message2 = $sce.trustAsHtml("Prova a ricaricare la pagina, se il problema persiste ti preghiamo di segnalare la cosa a <a href='mailto:energy4brain@generali.com?body="+wrapper+"%0D%0A%0D%0A"+error+"'>energy4brain@generali.com</a>");
                $scope.errorText = $rootScope.finalError;
                $scope.reportText = $rootScope.wrapperMemory;
            }
        };

        var getWhy = function (error) {
            var why = '';
            if (error.headers('X-gatoradeApp-error') === 'error.matchInvalid') {
                why = 'matchInvalid';
            } else if (error.headers('X-gatoradeApp-error') === 'error.matchElaborated') {
                why = 'matchElaborated';
            } else if (error.headers('X-gatoradeApp-error') === 'error.matchEnded') {
                why = 'matchEnded';
            } else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalous') {
                why = 'matchAnomalous';
            } else if (error.headers('X-gatoradeApp-error') === 'error.sessionAlreadyInUse') {
                why = 'sessionAlreadyInUse';
            } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSitecore') {
                why = 'invalidSitecore';
            } else if (error.headers('X-gatoradeApp-error') === 'error.missingSession') {
                why = 'missingSession';
            } else if (error.headers('X-gatoradeApp-error') === 'error.sendingData') {
                why = 'sendingData';
            } else if (error.headers('X-gatoradeApp-error') === 'error.failToSend') {
                why = 'failToSend';
            } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSession'){
                why = 'invalidSession';
            }else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalousRestartable'){
                why = 'matchAnomalousRestartable';
                $scope.wrapperMemory.match = {};
                //gestisco la response in base al servizio chiamato
                if (error.config.url.includes("init")){
                    $scope.wrapperMemory.match.game = error.data;
                } else if (error.config.url.includes("end") || error.config.url.includes("restart")){
                    $scope.wrapperMemory.match = error.data.match;
                    $scope.wrapperMemory.match.game = error.data.game;
                } else if (error.config.url.includes("/play/attempt") || error.config.url.includes("/play/attempt") || error.config.url.includes("v2")) {
                    $scope.wrapperMemory.match = error.data.match;
                }
                $scope.wrapperMemory.match.bestLevel = error.headers("bestLevel");
                $scope.wrapperMemory.match.bestScore = error.headers("bestScore");
            } else if (error.headers('X-gatoradeApp-error') === 'error.timeout') {
                why = 'timeout';
                $scope.wrapperMemory.match = {};
                $scope.wrapperMemory.match = error.data.match;
                $scope.wrapperMemory.match.bestLevel = error.headers("bestLevel");
                $scope.wrapperMemory.match.bestScore = error.headers("bestScore");
            } else {
                if (offlineOnFirstAttempt){
                    why = '';
                } else {
                    why = 'genericError';
                }

            }
            return why;
        };

        var manageError = function (event, attempt, error, why) {

            $rootScope.wrapperMemory = $scope.wrapperMemory;
            $rootScope.finalError = error;
            if ($scope.isOnline && why !== 'genericError') {
                removeEvent(eventName, $scope.handle);
                $state.go("ended", {
                    "gameid": $stateParams.gameid,
                    "playtoken": $stateParams.playtoken,
                    "sessionid": $stateParams.sessionid,
                    "why": why
                });
            } else {
                if (offlineOnFirstAttempt && why !== 'genericError'){
                    removeEvent(eventName, $scope.handle);
                    setupOffline(false, true);
                }else{
                    if (why === 'genericError'){
                        $scope.wrapperMemory.error = error;
                        if ($scope.wrapperMemory.match !== undefined){
                            PlaygameService.errorAsync($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
                        } else {
                            PlaygameService.errorAsync(-1, $stateParams.playtoken, $scope.wrapperMemory);
                        }
                    }
                    switch (event) {
                        case "START_ATTEMPT":
                            console.log('MANAGE OFFLINE: START_ATTEMPT');
                            startLocalAttempt();
                            break;
                        case "STOP_ATTEMPT": // è un cancel attempt
                            console.log('MANAGE OFFLINE: STOP_ATTEMPT');
                            attemptLocalEnded(attempt.score, attempt.level, attempt.completed, attempt.ended);
                            break;
                        case "ATTEMPT_ENDED":
                            console.log('MANAGE OFFLINE: ATTEMPT_ENDED');
                            attemptLocalEnded(attempt.score, attempt.level, attempt.completed, attempt.ended);
                            break;
                        case "ATTEMPT_RESTARTED":
                            console.log('MANAGE OFFLINE: ATTEMPT_RESTARTED');
                            attemptLocalRestarted(attempt.score, attempt.level, attempt.completed, attempt.ended);
                            break;
                        case "GAME_LOADED":
                            console.log('MANAGE OFFLINE: GAME_LOAD');
                            break;
                        case "GAME_UNLOADED":
                            console.log('MANAGE OFFLINE: GAME_UNLOAD');
                            break;
                        default:
                            console.log(event);
                            setupOffline(true, false);
                            break;
                    }
                }
            }
        };

        $scope.handle = function (e) {
            switch (e.data.action) {
                case "UPDATE_LEVEL":
                    console.log('UPDATE_LEVEL');
                    updateAttemptScore(e.data.attempt.score, e.data.attempt.level);
                    break;
                case "UPDATE_SCORE":
                    console.log('UPDATE_SCORE');
                    updateAttemptScore(e.data.attempt.score, e.data.attempt.level);
                    break;
                case "START_ATTEMPT":
                    console.log('START_ATTEMPT');
                    startAttempt();
                    break;
                case "STOP_ATTEMPT": // è un cancel attempt
                    console.log('STOP_ATTEMPT');
                    var endedInfo = e.data.attempt;
                    attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_ENDED":
                    console.log('ATTEMPT_ENDED');
                    var endedInfo = e.data.attempt;
                    attemptEnded(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "ATTEMPT_RESTARTED":
                    console.log('ATTEMPT_RESTARTED');
                    var endedInfo = e.data.attempt;
                    attemptRestarted(endedInfo.score, endedInfo.level, endedInfo.completed, endedInfo.ended);
                    break;
                case "GAME_LOADED":
                    console.log('GAME_LOAD');
                    break;
                case "GAME_UNLOADED":
                    console.log('GAME_UNLOAD');
                    break;
                default:
                    break;
            }
        };
        // Listen to message from child window
        addEvent(eventName, $scope.handle, false);

        $scope.$on('$locationChangeStart', function (event, next, current) {
            console.log('locationChangeStart');
            try {
                $scope.wrapperMemory.endFrom = 'locationChangeStart';
                //salvo la data di richiesta di fine match, verrà inoltrata nel report
                $scope.wrapperMemory.endMatchDate = Date.now();
                if (next.includes("#/finished")) {
                    PlaygameService.report($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
                    if ($scope.wrapperMemory.currAttempt === undefined) {
                        PlaygameService.syncEndMatch($scope.wrapperMemory.game.id, "",
                            $stateParams.playtoken,
                            $scope.wrapperMemory.match.id,
                            undefined,
                            undefined,
                            undefined,
                            $scope.matchToken,
                            $scope.wrapperMemory.attempts);
                    } else {
                        PlaygameService.syncEndMatch($scope.wrapperMemory.game.id, "",
                            $stateParams.playtoken,
                            $scope.wrapperMemory.match.id,
                            $scope.wrapperMemory.currAttempt,
                            $scope.wrapperMemory.currAttempt.attemptScore,
                            $scope.wrapperMemory.currAttempt.level,
                            $scope.matchToken,
                            $scope.wrapperMemory.attempts);
                    }
                    removeEvent(eventName, $scope.handle);
                }
            } catch (e) {
                $scope.wrapperMemory.exception = e;
                PlaygameService.report($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
            }
        });

        $scope.game = {url: "htmlgames/loading.html"};

        $scope.$on('timer-tick', function (event, args) {
            if (args.seconds !== undefined) {
                var now = Date.now();
                if ($scope.timerEndTimestamp === -1){
                    $scope.timerEndTimestamp = ($scope.maxDuration - $scope.timeSpent)*1000 + now;
                    console.log('Its '+now+' match end at '+$scope.timerEndTimestamp);
                }
                var timestampToEnd = $scope.timerEndTimestamp - now;
                var timeToEnd = timestampToEnd/1000;
                var total = (timeToEnd * 100 / $scope.maxDuration);
                var lastProgressBar = $scope.progressBar;
                $scope.progressBar = total <= lastProgressBar ? total : lastProgressBar;
                document.getElementById("progressbar").setAttribute('aria-valuenow', $scope.progressBar);
                document.getElementById("progressbar").setAttribute('style', "width: "+$scope.progressBar+"%;");
                if ($scope.timerEndTimestamp <= now){
                    $scope.matchEnded('timerEndTimestamp < now');
                    $scope.$broadcast('timer-stop')
                } else {
                    var tk = args.seconds % 30;
                    //console.log($scope.wrapperMemory.currAttempt != undefined);
                    if ($scope.wrapperMemory.currAttempt != undefined && tk == 0) {
                        console.log('score/level update vs server');
                        PlaygameService.updateAttemptScore($scope.wrapperMemory.currAttempt, $scope.wrapperMemory.match, $scope.matchToken).then(function (response) {
                            console.log('Score/Level updated');
                            offlineOnFirstAttempt = false;
                        })
                            .catch(function (error) {
                                PlaygameService.errorAsync($scope.wrapperMemory.match.id, $stateParams.playtoken, error);
                                var why = getWhy(error);
                                if (why === 'timeout'){
                                    $scope.matchEnded('updateAttemptScore');
                                }
                            });

                        PlaygameService.syncOfflineAttempts($scope.wrapperMemory.attemptsOffline, $scope.wrapperMemory.match).then(function(response){
                            $scope.wrapperMemory.attemptsOffline = {}
                        })
                            .catch(function (error){
                                console.log('Offline attempts sync failed: ');
                                console.log(error);
                            })
                    }
                }
            }

        });

        //controllo parametro di rigioco in arrivo da link di gioco
        $scope.wrapperMemory.replay = $stateParams.replay;
        $scope.wrapperMemory.bp = $stateParams.bp;
        PlaygameService.getGameInit(gameId, $stateParams.playtoken, $stateParams.sessionid, $stateParams.bp).then(function (response) {
            $scope.game = response.data;
            $scope.wrapperMemory.game = response.data;
            $scope.wrapperMemory.player = {};
            $scope.wrapperMemory.player.playtoken = playtoken;
            if ($scope.game.type === 'LEVEL') {
                useLevels = true;
            }
            $scope.wrapperMemory.startMatchDate = Date.now();
            PlaygameService.createMatch($stateParams.gameid, null, $stateParams.playtoken, $stateParams.playtoken, $stateParams.sessionid, $scope.matchToken, $scope.wrapperMemory.replay)
                .then(function (response) {
                    $scope.wrapperMemory.match = response.data.match;
                    if ($scope.wrapperMemory.match.replayState === 'cloned'){
                        $rootScope.wrapperMemory = $scope.wrapperMemory;
                        console.log('Caso di rigioco "false" match clonato corretamente match id: '+$scope.wrapperMemory.match.id+" match di riferimento: "+$scope.wrapperMemory.match.parentId);
                        $state.go("ended", {
                            "gameid": $stateParams.gameid,
                            "playtoken": $stateParams.playtoken,
                            "sessionid": $stateParams.sessionid,
                            "why": "cloneSuccessfully"
                        });
                    }
                    $scope.timeSpent = $scope.wrapperMemory.match.timeSpent;
                    $scope.maxDuration = $scope.wrapperMemory.match.template.maxDuration;
                    if ($scope.timeSpent < $scope.maxDuration) {
                        var myTime = $scope.maxDuration - $scope.timeSpent;
                        console.log('Start a new session with a duration ' + myTime);
                        //$scope.$broadcast('timer-set-countdown-seconds', myTime * 2);
                    }
                    else {
                        console.log('Tempo scaduto in quanto il tempo massimo è ' + $scope.maxDuration + ' è quello giocato è ' + timeSpent);
                        $state.go("ended", {
                            "gameid": $stateParams.gameid,
                            "playtoken": $stateParams.playtoken,
                            "sessionid": $stateParams.sessionid,
                            "why": "timeout"
                        });
                    }
                }).catch(function (error) {
                    manageError("CREATE_MATCH", null, error, getWhy(error));
            });
        })
            .catch(function (error) {
                manageError("GAME_INIT", null, error, getWhy(error));
            });

        var startAttempt = function () {
            if (failedToStopAttempt){
                failedToStopAttempt = false;
                if ($scope.wrapperMemory.currAttempt !== undefined){
                    attemptRestarted($scope.wrapperMemory.currAttempt.attemptScore, $scope.wrapperMemory.currAttempt.levelReached, $scope.wrapperMemory.currAttempt.completed, Date.now())
                }
            } else {
                if (offlineOnFirstAttempt){
                    //salvo la data di avvio primo attempt, verrà inoltrata nel report
                    $scope.wrapperMemory.firstAttemptStartDate = Date.now();
                }
                if ($scope.wrapperMemory.match === undefined) {
                    console.log("creo attempt SENZA match");
                    PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken, null, $stateParams.sessionid, $scope.matchToken)
                        .then(function (response) {
                            offlineOnFirstAttempt = false;
                            refreshWrapperMemory(response.data.match, response.data.attempt);
                        })
                        .catch(function (error) {
                            var why = getWhy(error);
                            if (why !== 'timeout'){
                                manageError("START_ATTEMPT", null, error, why);
                            }else{
                                $scope.matchEnded('timeout from createAttempt');
                            }
                        });

                } else {
                    console.log("creo attempt CON match");
                    PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken, $scope.wrapperMemory.match.id, $stateParams.sessionid, $scope.matchToken)
                        .then(function (response) {
                            offlineOnFirstAttempt = false;
                            refreshWrapperMemory(response.data.match, response.data.attempt);
                        })
                        .catch(function (error) {
                            var why = getWhy(error);
                            if (why !== 'timeout'){
                                manageError("START_ATTEMPT", null, error, why);
                            }else{
                                $scope.matchEnded('timeout from createAttempt');
                            }
                        });
                }
                $scope.wrapperMemory.timerStart = Date.now();
                $scope.$broadcast('timer-start');
            }
        };

        var startLocalAttempt = function () {
            var now = Date.now();
            var newAttempt = {};
            if ($scope.wrapperMemory.match == undefined) {
                console.log("creo attempt locale SENZA match");
                newAttempt = {
                    "localId": now,
                    "match": "",
                    "startAttempt": new Date(now),
                    "lastUpdate": new Date(now),
                    "attemptScore": 0,
                    "levelReached": "0",
                    "completed": false,
                    "cancelled": false,
                    "valid": true,
                    "sync": 0
                };
            } else {
                console.log("creo attempt CON match");
                $scope.wrapperMemory.match.matchToken = $scope.matchToken;
                newAttempt = {
                    "localId": now,
                    "match": $scope.wrapperMemory.match,
                    "startAttempt": new Date(now),
                    "lastUpdate": new Date(now),
                    "attemptScore": 0,
                    "levelReached": "0",
                    "completed": false,
                    "cancelled": false,
                    "valid": true,
                    "sync": 0
                };
            }
            refreshWrapperMemory($scope.wrapperMemory.match, newAttempt);
            $scope.wrapperMemory.attemptsOffline[$scope.wrapperMemory.currAttempt.localId] = $scope.wrapperMemory.currAttempt;
            $scope.wrapperMemory.timerStart = Date.now();
            $scope.$broadcast('timer-start');
        };

        var updateAttemptScore = function (score, level) {
            if ($scope.wrapperMemory.currAttempt == undefined)
                return;
            $scope.updateCount = $scope.updateCount + 1;
            $scope.wrapperMemory.currAttempt.attemptScore = score;
            //risolve utilizzo di due diciture, al momento level e levelReached devono contenere lo stesso valore
            $scope.wrapperMemory.currAttempt.level = level;
            $scope.wrapperMemory.currAttempt.levelReached = level;
        };

        var attemptEnded = function (score, level, completed, endDate) {
            var trueLevel = 0;
            var trueScore = 0;
            if (useLevels) {
                console.log("devo usare level : " + trueLevel + " score vale " + trueScore);
                trueLevel = score;
            }
            else {
                trueScore = score;
            }
            console.log('Attempt ended');
            PlaygameService.endAttempt(gameId, $scope.wrapperMemory.currAttempt, trueScore, trueLevel, completed, false, $scope.matchToken, $scope.wrapperMemory.match)
                .then(function (response) {
                    //chiuso l'attempt, il current è null
                    $scope.wrapperMemory.currAttempt.stopAttempt = endDate;
                    $scope.wrapperMemory.currAttempt.sync = 1;
                    $scope.wrapperMemory.currAttempt.completed = true;
                    $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
                    delete $scope.wrapperMemory.attemptsOffline[$scope.wrapperMemory.currAttempt.localId];
                    $scope.wrapperMemory.currAttempt = undefined;
                    console.log('Attempt ended inside callback');
                })
                .catch(function (error) {
                    offlineOnFirstAttempt = false;
                    var data = {
                        "score": score,
                        "level": level,
                        "completed": completed
                    };
                    var why = getWhy(error);
                    if (why !== 'timeout'){
                        manageError("ATTEMPT_ENDED", data, error, why);
                    }else{
                        $scope.matchEnded('timeout from endAttempt');
                    }
                });
        };

        var attemptLocalEnded = function (score, level, completed, endDate) {
            var trueLevel = 0;
            var trueScore = 0;
            //dal plugin construct il livello arriva comunque dalla variabile SCORE
            //TODO: fare comunque una verifica definitiva
            if (useLevels) {
                trueLevel = score;
            } else {
                trueScore = score;
            }
            if ($scope.wrapperMemory.currAttempt === undefined){
                failedToStopAttempt = true;
            } else {
                console.log('Attempt local ended');
                $scope.wrapperMemory.currAttempt.attemptScore = trueScore;
                //risolve utilizzo di due diciture, al momento level e levelReached devono contenere lo stesso valore
                $scope.wrapperMemory.currAttempt.levelReached = trueLevel;
                $scope.wrapperMemory.currAttempt.level = trueLevel;
                $scope.wrapperMemory.currAttempt.completed = completed;
                $scope.wrapperMemory.currAttempt.endmatch = false;
                $scope.wrapperMemory.currAttempt.sync = 0;
                $scope.wrapperMemory.currAttempt.lastUpdate = endDate;
                $scope.wrapperMemory.currAttempt.stopAttempt = endDate;
                $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
                $scope.wrapperMemory.attemptsOffline[$scope.wrapperMemory.currAttempt.localId] = $scope.wrapperMemory.currAttempt;
                $scope.wrapperMemory.currAttempt = undefined;
            }
        };

        /*var attemptRestarted = function (score, level, completed, endDate) {
            var trueLevel = 0;
            var trueScore = 0;
            if (useLevels) {
                trueLevel = score;
            }
            else {
                trueScore = score;
            }
            console.log('Attempt restarted');
            PlaygameService.endAttempt(gameId, $scope.wrapperMemory.currAttempt, trueScore, trueLevel, completed, false, $scope.matchToken, $scope.wrapperMemory.match)
                .then(function (response) {
                    //chiuso l'attempt, il current è null
                    $scope.wrapperMemory.currAttempt.stopAttempt = new Date(Date.now());
                    $scope.wrapperMemory.currAttempt.sync = 1;
                    $scope.wrapperMemory.currAttempt.completed = true;
                    $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
                    delete $scope.wrapperMemory.attemptsOffline[$scope.wrapperMemory.currAttempt.localId];
                    $scope.wrapperMemory.currAttempt = undefined;
                    console.log('Attempt restarted inside callback');
                    console.log($scope.wrapperMemory);
                    startAttempt();
                })
                .catch(function (error) {
                    var data = {
                        "score": score,
                        "level": level,
                        "completed": completed
                    };
                    manageError("ATTEMPT_RESTARTED", data, error, "genericError");
                });
        };*/

        var attemptRestarted = function (score, level, completed, endDate) {
            var trueLevel = 0;
            var trueScore = 0;
            if (useLevels) {
                trueLevel = score;
            }
            else {
                trueScore = score;
            }
            console.log('Attempt restarted');
            //risolve utilizzo di due diciture, al momento level e levelReached devono contenere lo stesso valore
            $scope.wrapperMemory.currAttempt.level = trueLevel;
            $scope.wrapperMemory.currAttempt.levelReached = trueLevel;
            $scope.wrapperMemory.currAttempt.attemptScore = trueScore;
            PlaygameService.restartAttemptToServer(gameId, $scope.wrapperMemory.currAttempt, $scope.wrapperMemory.match, $scope.matchToken, $stateParams.sessionid, false)
                .then(function (response) {
                    $scope.wrapperMemory.currAttempt.stopAttempt = endDate;
                    $scope.wrapperMemory.currAttempt.sync = 1;
                    $scope.wrapperMemory.currAttempt.completed = true;
                    $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
                    $scope.wrapperMemory.currAttempt = response.data.attempt;
                })
                .catch(function (error) {
                    var data = {
                        "score": score,
                        "level": level,
                        "completed": completed
                    };
                    var why = getWhy(error);
                    if (why !== 'timeout'){
                        manageError("ATTEMPT_RESTARTED", data, error, getWhy(error));
                    }else{
                        $scope.matchEnded('timeout from restartAttemptToServer');
                    }
                });
        };

        var attemptLocalRestarted = function (score, level, completed, endDate) {
            attemptLocalEnded(score, level, completed, endDate);
            console.log('Attempt restarted locally');
            console.log($scope.wrapperMemory);
            startAttempt();
        };

        var refreshWrapperMemory = function (match, attempt) {
            $scope.wrapperMemory.match = match;
            $scope.wrapperMemory.currAttempt = attempt;
            $scope.wrapperMemory.currAttempt.attemptScore = 0;
            $scope.wrapperMemory.currAttempt.level = 0;
//	        $scope.wrapperMemory.attempts.push(attempt);
        };

        $scope.matchEnded = function (matchendFrom) {
            console.log('Inside end match');
            removeEvent(eventName, $scope.handle);
            //eseguo prima endmatch
            var tmpLevel = '';
            var tmpScore = 0;
            if ($scope.wrapperMemory.currAttempt !== undefined) {
                if ($scope.wrapperMemory.game.type === 'MINPOINT' && $scope.wrapperMemory.currAttempt.attemptScore === 0) {
                    tmpScore = $scope.wrapperMemory.game.defaultScore;
                } else {
                    tmpScore = $scope.wrapperMemory.currAttempt.attemptScore;
                }
                tmpLevel = $scope.wrapperMemory.currAttempt.level;
            }
            //salvo la data di richiesta di fine match, verrà inoltrata nel report
            $scope.wrapperMemory.endMatchDate = Date.now();
            //salvo da dove viene fatta la richiesta di fine match
            $scope.wrapperMemory.endFrom = matchendFrom;
            PlaygameService.endMatch($scope.wrapperMemory.game.id, "", $stateParams.playtoken, $scope.wrapperMemory.match.id, $scope.wrapperMemory.currAttempt, $scope.matchToken, $scope.wrapperMemory.attempts, tmpScore,
                tmpLevel, $scope.wrapperMemory.attemptsOffline)
                .then(function (response) {
                    // se endmatch va a buon fine eseguo l'invio del report
                    $scope.wrapperMemory.match = response.data.match;
                    $rootScope.wrapperMemory = $scope.wrapperMemory;
                    PlaygameService.reportAsync($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory)
                        .then(function (response) {
                            $state.go("ended", {
                                "gameid": $stateParams.gameid,
                                "playtoken": $stateParams.playtoken,
                                "sessionid": $stateParams.sessionid,
                                "why": "timeout"
                            });
                        })
                        .catch(function (error) {
                            //se l'invio del report non va a buon fine redirect alla pagina di errore
                            PlaygameService.errorAsync($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.errorText);
                                $state.go("ended", {
                                    "gameid": $stateParams.gameid,
                                    "playtoken": $stateParams.playtoken,
                                    "sessionid": $stateParams.sessionid,
                                    "why": "genericError"
                                });
                        });
                })
                .catch(function (error) {
                    manageError("MATCH_ENDED", null, error, getWhy(error));
                });
        };

        // $scope.countDownCallbackFunction = function () {
        //     console.log("countDownCallbackFunction");
        //     $scope.matchEnded('countDownCallbackFunction');
        // };

        var beforeUnloadTimeout = 0;
        $(window).bind('beforeunload', function () {
            console.log('beforeunload');
            beforeUnloadTimeout = setTimeout(function () {
                console.log('settimeout function');
            }, 500);
            return 'Se chiudi la finestra o cambi indirizzo la tua sessione sarà invalidata! Vuoi procedere comunque?';
        });

        $(window).bind('unload', function () {
            try {
                var tmpScore = 0;
                var tmpLevel = '';
                if ($scope.wrapperMemory.currAttempt !== undefined){
                    if ($scope.wrapperMemory.game.type === 'MINPOINT' && $scope.wrapperMemory.currAttempt.attemptScore === 0) {
                        tmpScore = $scope.wrapperMemory.game.defaultScore;
                    }else{
                        tmpScore = $scope.wrapperMemory.currAttempt.attemptScore;
                    }
                    tmpLevel = $scope.wrapperMemory.currAttempt.level;
                }
                $scope.wrapperMemory.match.stop = new Date(Date.now());
                $scope.wrapperMemory.endFrom = 'unload';
                //salvo la data di richiesta di fine match, verrà inoltrata nel report
                $scope.wrapperMemory.endMatchDate = Date.now();
                PlaygameService.report($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
                PlaygameService.syncEndMatch($scope.wrapperMemory.game.id, "",
                    $stateParams.playtoken,
                    $scope.wrapperMemory.match.id,
                    $scope.wrapperMemory.currAttempt,
                    tmpScore,
                    tmpLevel,
                    $scope.matchToken,
                    $scope.wrapperMemory.attempts);

                if (typeof beforeUnloadTimeout !== 'undefined' && beforeUnloadTimeout !== 0) {
                    clearTimeout(beforeUnloadTimeout);
                }
                removeEvent(eventName, $scope.handle)
            } catch (e) {
                $scope.wrapperMemory.exception = e;
                PlaygameService.report($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
            }
        });
    }
})();
