"use strict";
var domain = "*";

var operations = Object.freeze({
	UPDATE_LEVEL:"UPDATE_LEVEL",
	UPDATE_SCORE:"UPDATE_SCORE",
	START_ATTEMPT:"START_ATTEMPT",
	STOP_ATTEMPT:"STOP_ATTEMPT",
	ATTEMPT_ENDED:"ATTEMPT_ENDED",
	ATTEMPT_RESTARTED:"ATTEMPT_RESTARTED",
	MATCH_ENDED:"MATCH_ENDED",
	GAME_LOADED: "GAME_LOADED",
	GAME_UNLOADED:"GAME_UNLOADED"
})

var Attempt = function(){

		this.score = null
		this.level = null
		this.started = null
		this.ended = null
		this.completed = null

}
var Gatorade = {
	Message : function(action, attempt){
	this.attempt = attempt
	this.action = action
}
}

var currentattempt = null;



function startAttempt ()
	{

		currentattempt = new Attempt();

        console.log("New attempt started ");
        currentattempt.score = 0
		currentattempt.started = new Date()
		currentattempt.completed = false
        var m = new Gatorade.Message(operations.START_ATTEMPT, currentattempt)
		window.parent.postMessage(m, domain)

	}
function stopAttempt(score)
	{

		if (currentattempt === null){
			console.log("warning: attempt has to be created, first")
			return
		}
		currentattempt.score = score
		currentattempt.ended = new Date()
        console.log("Attempt stopped: with score " + score);

        var m = new Gatorade.Message(operations.STOP_ATTEMPT, currentattempt)
		window.parent.postMessage(m, domain)
		currentattempt = null
	}
function updateScore(score)
	{
		if (currentattempt === null){
			console.log("warning: attempt has to be created, first")
			return
		}
        console.log("Score updated! score: " + score);
        currentattempt.score = score
        var m = new Gatorade.Message(operations.UPDATE_SCORE, currentattempt);
		window.parent.postMessage(m, domain)
		//updateScore()
	}
function updateLevel(level)
	{
		// alert the message
		if (currentattempt === null){
			console.log("warning: attempt has to be created, first")
			return
		}
        console.log("Level updated! level: " + level);
        currentattempt.level = level
        var m = new Gatorade.Message(operations.UPDATE_LEVEL, currentattempt);
		window.parent.postMessage(m, domain)
		//updateScore()
	}
function attemptEnded(score)
	{
		if (currentattempt === null){
			console.log("warning: attempt has to be created, first")
			return
		}
		console.log("game finished, sending " +  score + " as end points")

		currentattempt.completed = true
        currentattempt.score = score
		currentattempt.ended = new Date()

        var m = new Gatorade.Message(operations.ATTEMPT_ENDED, currentattempt)
        window.parent.postMessage(m, domain)
		currentattempt = null
	}
function matchEnded (score)
	{
		if (currentattempt === null){
			console.log("warning: attempt has to be created, first")
			return
		}
		console.log("game finished, sending " +  score + " as end points")

        currentattempt.score = score
		currentattempt.completed = true
		currentattempt.ended = new Date()

        var m = new Gatorade.Message(operations.MATCH_ENDED, currentattempt)
        window.parent.postMessage(m, domain)
		currentattempt = null
	}
function restartAttempt(score) {
	if (currentattempt === null){
			console.log("warning: attempt has to be created, first")
			return
	}
	console.log("game restarted, sending " +  score + " as end points")
	currentattempt.completed = true
	currentattempt.score = score
	currentattempt.ended = new Date()

	var m = new Gatorade.Message(operations.ATTEMPT_RESTARTED, currentattempt)
	window.parent.postMessage(m, domain)

	currentattempt = new Attempt();
	currentattempt.score = 0
	currentattempt.started = new Date()
	currentattempt.completed = false
}
