(function () {
    'use strict';

    angular
        .module('gatoradeApp')
        .controller('PlaygameController', PlaygameController);

    PlaygameController.$inject = ['$scope', '$rootScope', 'Principal', 'LoginService', '$state', 'PlaygameService', '$sce', '$stateParams', '$interval'];

    function PlaygameController($scope, $rootScope, Principal, LoginService, $state, PlaygameService, $sce, $stateParams, timer, $interval) {
        $scope.isOnline = true;
        Offline.on("up", function () {
            $scope.isOnline = true;
            console.log("Sending offline attempts for sync: ");
            console.log($scope.wrapperMemory.attemptsOffline);
            PlaygameService.syncOfflineAttempts($scope.wrapperMemory.attemptsOffline, $scope.wrapperMemory.match)
                .then(function(response){
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
        $scope.showReport = true;
        $scope.showError = true;
        // IE + others compatible event handler
        var offlineOnFirstAttempt = true;
        var addEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var removeEventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
        var addEvent = window[addEventMethod];
        var removeEvent = window[removeEventMethod];
        var gameId = $stateParams.gameid;
        var playtoken = $stateParams.playtoken;
        var eventName = addEventMethod == "attachEvent" ? "onmessage" : "message";
        var useLevels = false;

        var setupOffline = function (showReport, offline) {
            $scope.showGame = false;
            if (offline){
                $scope.message1 = "Si è verificato un problema con la tua connessione";
                $scope.message2 = "Ti preghiamo di controllare la tua connessione";
            }else{
                $scope.message1 = 'Si è verificato un errore imprevisto. ';
                $scope.message2 = 'Ti preghiamo di segnalare la cosa all\'amministratore del sistema.';
            }
            if (showReport){
                $scope.message2 = "Ti preghiamo di inviare le informazioni che trovi in calce all\'amministratore del sistema.";
                $scope.errorText = $rootScope.finalError;
                $scope.reportText = $rootScope.wrapperMemory;
            }
        };

        var checkOffline = function () {
            /* MSIE used to detect old browsers and Trident used to newer ones*/
            if (navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1){
                console.log("IE check if offline");
                return PlaygameService.isOnline();
            }else{
                console.log("check if offline "+navigator.onLine);
                return navigator.onLine;
            }
        };
        var manageError = function (event, attempt, error, why) {

            $rootScope.wrapperMemory = $scope.wrapperMemory;
            $rootScope.finalError = error;
            if ($scope.isOnline) {
                removeEvent(eventName, $scope.handle);
                $state.go("ended", {
                    "gameid": $stateParams.gameid,
                    "playtoken": $stateParams.playtoken,
                    "sessionid": $stateParams.sessionid,
                    "why": why
                });
            }
            else {
                if (offlineOnFirstAttempt){
                    removeEvent(eventName, $scope.handle);
                    setupOffline(false, true);
                }else{
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
        }
        // Listen to message from child window
        addEvent(eventName, $scope.handle, false);

        $scope.$on('$locationChangeStart', function (event, next, current) {
            console.log('locationChangeStart');
            PlaygameService.report($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
            if ($scope.wrapperMemory.currAttempt == undefined) {
                PlaygameService.syncEndMatch($scope.wrapperMemory.game.id, "",
                    $stateParams.playtoken,
                    $scope.wrapperMemory.match.id,
                    undefined,
                    undefined,
                    undefined,
                    $scope.matchToken,
                    $scope.wrapperMemory.attempts);
            }
            else {
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
        });

        $scope.game = {url: "htmlgames/loading.html"}

        $scope.$on('timer-tick', function (event, args) {
            if (args.seconds !== undefined) {
                if ($scope.timerEndTimestamp == -1){
                    $scope.timerEndTimestamp = ($scope.maxDuration - $scope.timeSpent)*1000 + Date.now();
                }
                var now = Date.now();
                var timestampToEnd = $scope.timerEndTimestamp - now;
                var timeToEnd = timestampToEnd/1000;
                var total = (timeToEnd * 100 / $scope.maxDuration);
                $scope.progressBar = total <= 100 ? total : 100;
                /*console.log("now: "+now);
                console.log("time stamp to end: "+timestampToEnd);
                console.log("time to end: "+timeToEnd);
                console.log("total: "+total);
                console.log("progressbar: "+$scope.progressBar);*/
                var tk = args.seconds % 30;
                console.log($scope.wrapperMemory.currAttempt != undefined);
                if ($scope.wrapperMemory.currAttempt != undefined && tk == 0) {
                    console.log('score/level update vs server');
                    PlaygameService.updateAttemptScore($scope.wrapperMemory.currAttempt, $scope.wrapperMemory.match, $scope.matchToken).then(function (response) {
                        console.log('Score/Level updated');
                        offlineOnFirstAttempt = false;
                    })
                        .catch(function (error) {
                            PlaygameService.errorAsync($scope.wrapperMemory.match.id, $stateParams.playtoken, error);
                            var why = '';
                            if (error.headers('X-gatoradeApp-error') === 'error.matchInvalid'){
                                why = 'matchInvalid';
                            }else if (error.headers('X-gatoradeApp-error') === 'error.matchElaborated'){
                                why = 'matchElaborated';
                            } else if (error.headers('X-gatoradeApp-error') === 'error.matchEnded'){
                                why = 'matchEnded';
                            } else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalous'){
                                why = 'matchAnomalous';
                            } else if (error.headers('X-gatoradeApp-error') === 'error.sessionAlreadyInUse') {
                                why = 'sessionAlreadyInUse';
                            } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSitecore'){
                                why = 'invalidSitecore';
                            } else{
                                why = 'genericError';
                            }
                            manageError("START_ATTEMPT", null, error, why);
                        });
                }
            }

        });

        //controllo parametro di rigioco in arrivo da link di gioco
        var replay = $stateParams.replay;
        console.log("REPLAY = " + replay);
        PlaygameService.getGameInit(gameId, $stateParams.playtoken, $stateParams.sessionid, $stateParams.bp).then(function (response) {
            $scope.game = response.data;
            $scope.wrapperMemory.game = response.data;
            $scope.wrapperMemory.player = {};
            $scope.wrapperMemory.player.playtoken = playtoken;
            if ($scope.game.type == 'LEVEL') {
                useLevels = true;
            }
            PlaygameService.createMatch($stateParams.gameid, null, $stateParams.playtoken, $stateParams.playtoken, $stateParams.sessionid, $scope.matchToken, replay)
                .then(function (response) {
                    $scope.wrapperMemory.match = response.data.match;
                    if ($scope.wrapperMemory.match.replayState == 'cloned'){
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
                        $scope.$broadcast('timer-set-countdown-seconds', myTime);
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
                var why = "genericError";
                if (error.status == 400) {
                    why = "invalidSession";
                }
                manageError("CREATE_MATCH", null, error, why);
            });
        })
            .catch(function (error) {
                var why = "genericError";
                if (error.status == 400) {
                    why = "invalidSession";
                }

                manageError("GAME_INIT", null, error, why);
            });

        var startAttempt = function () {
            if ($scope.wrapperMemory.match == undefined) {
                console.log("creo attempt SENZA match");
                PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken, null, $stateParams.sessionid, $scope.matchToken)
                    .then(function (response) {
                        offlineOnFirstAttempt = false;
                        refreshWrapperMemory(response.data.match, response.data.attempt);
                    })
                    .catch(function (error) {
                        var why = '';
                        if (error.headers('X-gatoradeApp-error') === 'error.matchInvalid'){
                            why = 'matchInvalid';
                        }else if (error.headers('X-gatoradeApp-error') === 'error.matchElaborated'){
                            why = 'matchElaborated';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.matchEnded'){
                            why = 'matchEnded';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalous'){
                            why = 'matchAnomalous';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.sessionAlreadyInUse') {
                            why = 'sessionAlreadyInUse';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSitecore'){
                            why = 'invalidSitecore';
                        } else{
                            why = 'genericError';
                        }
                        manageError("START_ATTEMPT", null, error, why);
                    });

            }
            else {
                console.log("creo attempt CON match");
                PlaygameService.createAttempt(gameId, $stateParams.templateid, "", playtoken, $scope.wrapperMemory.match.id, $stateParams.sessionid, $scope.matchToken)
                    .then(function (response) {
                        offlineOnFirstAttempt = false;
                        refreshWrapperMemory(response.data.match, response.data.attempt);
                    })
                    .catch(function (error) {
                        var why = '';
                        if (error.headers('X-gatoradeApp-error') === 'error.matchInvalid'){
                            why = 'matchInvalid';
                        }else if (error.headers('X-gatoradeApp-error') === 'error.matchElaborated'){
                            why = 'matchElaborated';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.matchEnded'){
                            why = 'matchEnded';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalous'){
                            why = 'matchAnomalous';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.sessionAlreadyInUse') {
                            why = 'sessionAlreadyInUse';
                        } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSitecore'){
                            why = 'invalidSitecore';
                        } else{
                            why = 'genericError';
                        }
                        manageError("START_ATTEMPT", null, error, why);
                    });
            }
            $scope.$broadcast('timer-start');
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
                    $scope.wrapperMemory.currAttempt.stopAttempt = new Date(Date.now());
                    $scope.wrapperMemory.currAttempt.sync = 1;
                    $scope.wrapperMemory.currAttempt.completed = true;
                    $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
                    delete $scope.wrapperMemory.attemptsOffline[$scope.wrapperMemory.currAttempt.localId];
                    $scope.wrapperMemory.currAttempt = undefined;
                    console.log('Attempt ended inside callback');
                })
                .catch(function (error) {
                    var data = {
                        "score": score,
                        "level": level,
                        "completed": completed
                    };
                    var why = '';
                    if (error.headers('X-gatoradeApp-error') === 'error.matchInvalid'){
                        why = 'matchInvalid';
                    }else if (error.headers('X-gatoradeApp-error') === 'error.matchElaborated'){
                        why = 'matchElaborated';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.matchEnded'){
                        why = 'matchEnded';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalous'){
                        why = 'matchAnomalous';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.sessionAlreadyInUse') {
                        why = 'sessionAlreadyInUse';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSitecore'){
                        why = 'invalidSitecore';
                    } else{
                        why = 'genericError';
                    }
                    manageError("ATTEMPT_ENDED", data, error, why);
                });
        };

        var attemptLocalEnded = function (score, level, completed, endDate) {
            var trueLevel = 0;
            var trueScore = 0;
            //dal plugin construct il livello arriva comunque dalla variabile SCORE
            //TODO: fare comunque una verifica definitiva
            if (useLevels) {
                trueLevel = score;
            }
            else {
                trueScore = score;
            }

            console.log('Attempt local ended');
            $scope.wrapperMemory.currAttempt.attemptScore = trueScore;
            //risolve utilizzo di due diciture, al momento level e levelReached devono contenere lo stesso valore
            $scope.wrapperMemory.currAttempt.levelReached = trueLevel;
            $scope.wrapperMemory.currAttempt.level = trueLevel;
            $scope.wrapperMemory.currAttempt.completed = completed;
            $scope.wrapperMemory.currAttempt.endmatch = false;
            $scope.wrapperMemory.currAttempt.sync = 0;
            $scope.wrapperMemory.currAttempt.lastUpdate = new Date(Date.now());
            $scope.wrapperMemory.currAttempt.stopAttempt = new Date(Date.now());
            $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
            $scope.wrapperMemory.attemptsOffline[$scope.wrapperMemory.currAttempt.localId] = $scope.wrapperMemory.currAttempt;
            $scope.wrapperMemory.currAttempt = undefined;
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
                    $scope.wrapperMemory.currAttempt.sync = 1;
                    $scope.wrapperMemory.attempts.push($scope.wrapperMemory.currAttempt);
                    $scope.wrapperMemory.currAttempt = response.data.attempt;
                })
                .catch(function (error) {
                    var data = {
                        "score": score,
                        "level": level,
                        "completed": completed
                    };
                    var why = '';
                    if (error.headers('X-gatoradeApp-error') === 'error.matchInvalid'){
                        why = 'matchInvalid';
                    }else if (error.headers('X-gatoradeApp-error') === 'error.matchElaborated'){
                        why = 'matchElaborated';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.matchEnded'){
                        why = 'matchEnded';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.matchAnomalous'){
                        why = 'matchAnomalous';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.sessionAlreadyInUse') {
                        why = 'sessionAlreadyInUse';
                    } else if (error.headers('X-gatoradeApp-error') === 'error.invalidSitecore'){
                        why = 'invalidSitecore';
                    } else{
                        why = 'genericError';
                    }
                    manageError("ATTEMPT_RESTARTED", data, error, why);
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

        $scope.matchEnded = function () {
            console.log('Inside end match');
            removeEvent(eventName, $scope.handle);
            //eseguo prima endmatch
            var tmlLevel = '';
            var tmpScore = 0;
            if ($scope.wrapperMemory.currAttempt != undefined){
                tmpScore = $scope.wrapperMemory.currAttempt.attemptScore;
                tmlLevel = $scope.wrapperMemory.currAttempt.level;
            }
            PlaygameService.endMatch($scope.wrapperMemory.game.id, "", $stateParams.playtoken, $scope.wrapperMemory.match.id, $scope.wrapperMemory.currAttempt, $scope.matchToken, $scope.wrapperMemory.attempts, tmpScore,
                tmlLevel, $scope.wrapperMemory.attemptsOffline)
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
                    manageError("MATCH_ENDED", null, error, "genericError");
                });
        };

        $scope.countDownCallbackFunction = function () {
            $scope.matchEnded();
        };

        var beforeUnloadTimeout = 0;
        $(window).bind('beforeunload', function () {
            console.log('beforeunload');
            beforeUnloadTimeout = setTimeout(function () {
                console.log('settimeout function');
            }, 500);
            return 'Se chiudi la finestra o cambi indirizzo la tua sessione sarà invalidata! Vuoi procedere comunque?';
        });

        $(window).bind('unload', function () {
            $scope.wrapperMemory.match.stop = new Date(Date.now());
            PlaygameService.report($scope.wrapperMemory.match.id, $stateParams.playtoken, $scope.wrapperMemory);
            if ($scope.wrapperMemory.currAttempt == undefined) {
                PlaygameService.syncEndMatch($scope.wrapperMemory.game.id, "",
                    $stateParams.playtoken,
                    $scope.wrapperMemory.match.id,
                    undefined,
                    undefined,
                    undefined,
                    $scope.matchToken,
                    $scope.wrapperMemory.attempts);
            }
            else {
                PlaygameService.syncEndMatch($scope.wrapperMemory.game.id, "",
                    $stateParams.playtoken,
                    $scope.wrapperMemory.match.id,
                    $scope.wrapperMemory.currAttempt,
                    $scope.wrapperMemory.currAttempt.attemptScore,
                    $scope.wrapperMemory.currAttempt.level,
                    $scope.matchToken,
                    $scope.wrapperMemory.attempts);
            }

            if (typeof beforeUnloadTimeout != 'undefined' && beforeUnloadTimeout != 0) {
                clearTimeout(beforeUnloadTimeout);
            }
            removeEvent(eventName, $scope.handle)
        });
    }
})();
