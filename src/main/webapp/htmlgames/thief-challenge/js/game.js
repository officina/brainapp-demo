////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 *
 * GAME SETTING CUSTOMIZATION START
 *
 */
var gameLevelData = {totalPins:3, //game 1 total pins to start
					totalPinsIncrease:1, //game 1 total pins to increase for next
					timerPins:18000, //game 1 timer to start
					totalCombination:3, //game 2 total combination
					totalCombinationIncrease:1, //game 2 total combination to increase for next
					timerCombination:43000, //game 2 timer
					totalStep:3, //game 3 total step to start
					totalStepIncrease:1, //game 3 total step to increase for next
					timerStep:35000, //game 3 timer
					totalCable:3, //game 4 total cable to start
					totalCableIncrease:1, //game 4 total cable to increase for next
					timerCable:20000}; //game 4 timer

var timerBarColor = '#51b8ac'; //timer bar color
var timerBgBarColor = '#3B4F5E'; //timer background bar color
var timerBarH = 10; //timer bar height

var gameScorePerGame = 100; //game score per game

//game 1
var pinBgColor = '#293a4c'; //pin background level color
var pinTopColor = '#ddd'; //pin top color
var pinBottomColor = '#fff'; //pin bottom color
var pinSuccessColor = '#4fbbaf'; //pin success color
var pinHeight = 160; //pin height
var pinBgHeight = 310; //pin width

//game2
var combiNumber_arr = [0,3,7,10,13,17,20,23,27,30,33,37,40,43,47,50,53,57,60,63,67,70,73,77]; //combination number
var combinationLevelColor = '#4fbbaf'; //combination level color
var combinationLevelW = 18; //combination level width
var combinationLevelH = 400; //combination level height

//game4
var cableStroke = 8; //cable stroke
var cableColor = '#51b9ae'; //cable color

//result
var resultTitleText = 'GAME OVER'; //result title text
var resultScoreText = '[NUMBER]PTS'; //result score text

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = 'SHARE YOUR SCORE'; //social share message
var shareTitle = 'Highscore on Thief Challenge Game is [SCORE]PTS.';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Thief Challenge Game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */

var playerData = {score:0};
var gameData = {type:0, stageX:0, stageY:0, oldX:0, oldY:0, dirX:'', dirY:'', paused:false, timerEnable:false, timerStart:0, timerCount:0, timerTotal:0, timerSound:false, type_arr:[1,2,3,4], typeNum:0};
var game1Data = {totalPins:0, timerPins:0, lock_arr:[], lockSeq_arr:[], lockNum:0};
var game2Data = {totalCombination:0, timerCombination:0, direction:0, detect:true, detectNum:0, turnNum:0, rotation:0, cRotation:0, angle:0, angle_arr:[], seq_arr:[], seqNum:0, levelNum:0};
var game3Data = {totalStep:0, timerStep:0, totalPin:0, button_arr:[], number_arr:[], animateNum:0, clickNum:0, seq_arr:[], ready:false};
var game4Data = {totalCable:0, timerCable:0, pointNum:0, lineNum:0, lines_arr:[], point_arr:[], connect_arr:[], seq_arr:[]};

/*!
 *
 * GAME BUTTONS - This is the function that runs to setup button event
 *
 */
function buildGameButton(){
	buttonBegin.cursor = "pointer";
	buttonBegin.addEventListener("click", function(evt) {
		playSound('soundBonus');
		goPage('game');
	});

	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		playSound('soundBonus');
		goPage('game');
	});

	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonGoogle.cursor = "pointer";
	buttonGoogle.addEventListener("click", function(evt) {
		share('google');
	});

	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});

	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});

	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
}


/*!
 *
 * DISPLAY PAGES - This is the function that runs to display pages
 *
 */
var curPage=''
function goPage(page){
	curPage=page;

	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	prepareGame(0);

	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
		break;

		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;

		case 'result':
			targetContainer = resultContainer;
			playSound('soundFail');
			stopGame();
			saveGame(playerData.score);
			resultScoreTxt.text = resultScoreText.replace('[NUMBER]',playerData.score);
		break;
	}

	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
}

/*!
 *
 * START GAME - This is the function that runs to start play game
 *
 */

function startGame(){
	gameData.typeNum = 0;
	game1Data.totalPins = gameLevelData.totalPins;
	game2Data.totalCombination = gameLevelData.totalCombination;
	game3Data.totalStep = gameLevelData.totalStep;
	game4Data.totalCable = gameLevelData.totalCable;

	game1Data.timerPins = gameLevelData.timerPins;
	game2Data.timerCombination = gameLevelData.timerCombination;
	game3Data.timerStep = gameLevelData.timerStep;
	game4Data.timerCable = gameLevelData.timerCable;
	playerData.score = 0
	startAttempt()
	prepareGame(gameData.type_arr[gameData.typeNum]);
	//prepareGame(2);
}

 /*!
 *
 * STOP GAME - This is the function that runs to stop play game
 *
 */
function stopGame(){
	toggleGameTimer(false);
	stopSoundLoop('soundPowerLoop');
	stopSoundLoop('soundTimer');
	animateObject(timerBar, false);

	removeCombinationButton();
	removeLockButton();
	stopAttempt(playerData.score)
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

 /*!
 *
 * SETUP GAME - This is the function that runs to setup game
 *
 */
function setupGames(){
	//events
	stage.on("stagemousedown", function(evt) {
		gameData.stageX = evt.stageX
		gameData.stageY = evt.stageY;
	});
	stage.on("stagemousemove", function(evt) {
		gameData.stageX = evt.stageX
		gameData.stageY = evt.stageY;
	});
	stage.on("stagemouseup", function(evt) {

	});

	shuffle(gameData.type_arr);
}

function prepareGame(game){
	game1Container.visible = false;
	game2Container.visible = false;
	game3Container.visible = false;
	game4Container.visible = false;
	loaderContainer.visible = false;
	gameUnlockAnimate.visible = gameUnlockBg.visible = false;
	animateObject(gameLoader, false);
	var targetContainer = null;

	timerBgBar.visible = timerBar.visible = true;
	gameData.type = game;
	showInstruction(game);

	switch(game){
		case 0:
			targetContainer = loaderContainer;
			timerBgBar.visible = timerBar.visible = false;
			animateObject(gameLoader, true, true);
			drawTimerBar(false);
			break;

		case 1:
			targetContainer = game1Container;
			setupLockButton();
			itemPin.x = canvasW/100*20;
			itemPin.y = canvasH/100*65;

			drawLocks(game1Data.totalPins);
			shuffle(game1Data.lockSeq_arr);
			game1Data.lockNum = 0;
			toggleGameTimer(true, game1Data.timerPins);
		break;

		case 2:
			targetContainer = game2Container;
			playSoundLoop('soundPowerLoop');
			setupCombinationButton();
			createCombiLights(game2Data.totalCombination);
			toggleGameTimer(true, game2Data.timerCombination);
		break;

		case 3:
			targetContainer = game3Container;
			createPhoneButtons();
			insertCard();
			toggleGameTimer(true, game3Data.timerStep);
		break;

		case 4:
			targetContainer = game4Container;
			createWires(game4Data.totalCable);
			toggleGameTimer(true, game4Data.timerCable);
		break;
	}

	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}

	gameData.paused = false;
}

function prepareNextGame(){
	toggleGameTimer(false);
	stopSoundLoop('soundPowerLoop');
	stopSoundLoop('soundTimer');
	animateObject(timerBar, false);

	removeCombinationButton();
	removeLockButton();
	gameData.paused = true;


	TweenMax.to(gameUnlockAnimate, 1, {overwrite:true, onComplete:function(){
		playSound('soundSuccess');
		gameUnlockAnimate.visible = gameUnlockBg.visible = true;
		gameUnlockAnimate.gotoAndPlay('animate');

		var timerCount = gameData.timerTotal - gameData.timerCount;
		var totalScore = timerCount / gameData.timerTotal * gameScorePerGame;
		playerData.score += Math.floor(totalScore);
		updateScore(playerData.score)
		//updateGame
		if(gameData.type == 1){
			game1Data.totalPins += gameLevelData.totalPinsIncrease;
			game1Data.totalPins = game1Data.totalPins > 7 ? 7 : game1Data.totalPins;
		}else if(gameData.type == 2){
			game2Data.totalCombination += gameLevelData.totalCombinationIncrease;
			game2Data.totalCombination = game2Data.totalCombination > 6 ? 6 : game2Data.totalCombination;
		}else if(gameData.type == 3){
			game3Data.totalStep += gameLevelData.totalStepIncrease
			game3Data.totalStep = game3Data.totalStep > 6 ? 6 : game3Data.totalStep;
		}else if(gameData.type == 4){
			game4Data.totalCable += gameLevelData.totalCableIncrease
			game4Data.totalCable = game4Data.totalCable > 7 ? 7 : game4Data.totalCable;
		}

		TweenMax.to(gameUnlockAnimate, .8, {overwrite:true, onComplete:function(){
			playSound('soundDoorUnlock');
			TweenMax.to(gameUnlockAnimate, 1.2, {overwrite:true, onComplete:function(){
				prepareGame(0);
				TweenMax.to(gameUnlockAnimate, 2, {overwrite:true, onComplete:function(){
					gameData.typeNum++;
					if(gameData.typeNum > gameData.type_arr.length-1){
						gameData.typeNum = 0;
						shuffle(gameData.type_arr)
					}
					prepareGame(gameData.type_arr[gameData.typeNum]);
				}});
			}});
		}});
	}});
}

function showInstruction(game){
	gameInstruction1.visible = gameInstruction2.visible = gameInstruction3.visible = gameInstruction4.visible = false;

	switch(game){
		case 1:
			gameInstruction1.visible = true;
		break;

		case 2:
			gameInstruction2.visible = true;
		break;

		case 3:
			gameInstruction3.visible = true;
		break;

		case 4:
			gameInstruction4.visible = true;
		break;
	}

	TweenMax.to(instructionContainer, .2, {alpha:1, overwrite:true});
}

function hideInstruction(){
	TweenMax.to(instructionContainer, .2, {alpha:0, overwrite:true});
}

function animateObject(obj, con, alpha){
	if(con){
		var alphaNum = 1;
		if(alpha){
			alpha = false;
			alphaNum = .5;
		}else{
			alpha = true;
		}
		TweenMax.to(obj, .2, {alpha:alphaNum, overwrite:true, onComplete:animateObject, onCompleteParams:[obj, con, alpha]});
	}else{
		TweenMax.to(obj, .2, {alpha:1, overwrite:true});
	}
}

function dragWithinArea(obj, startX, endX, startY, endY){
	if(obj.x <= startX){
		obj.x = startX;
	}else if(obj.x >= endX){
		obj.x = endX;
	}

	if(obj.y <= startY){
		obj.y = startY;
	}else if(obj.y >= endY){
		obj.y = endY;
	}
}

/*!
 *
 * GAME 1 - This is the function that runs to setup game 1
 *
 */
function setupLockButton(){
	stage.addEventListener("stagemousedown", handlerLockMethod);
	stage.addEventListener("stagemousemove", handlerLockMethod);
	stage.addEventListener("stagemouseup", handlerLockMethod);
}

function removeLockButton(){
	stage.removeEventListener("stagemousedown", handlerLockMethod);
	stage.removeEventListener("stagemousemove", handlerLockMethod);
	stage.removeEventListener("stagemouseup", handlerLockMethod);
}

function handlerLockMethod(evt){
	switch (evt.type){
		 case 'mousedown':
		 	moveLockPicker(evt);
		 	break;

		 case 'stagemousemove':
		 	moveLockPicker(evt);
		 	break;

		 case 'stagemouseup':
		 	break;
	 }
}

function moveLockPicker(evt){
	itemPin.x = gameData.stageX - 380;
	dragWithinArea(itemPin, canvasW/100 * 20, canvasW/100 * 48, itemPin.y, itemPin.y);
	gameData.stageX = evt.stageX;
	gameData.stageY = evt.stageY;
}

function checkWithinLockArea(x){
	for(var n=0; n<game1Data.lock_arr.length; n++){
		var curLockX = game1Data.lock_arr[n].bg.x;
		if(x >= curLockX-30 && x <= curLockX+30){
			TweenMax.to(game1Data.lock_arr[n].bottom, .5, {y:game1Data.lock_arr[n].y-20, overwrite:true});
		}else{
			TweenMax.to(game1Data.lock_arr[n].bottom, .5, {y:game1Data.lock_arr[n].y, overwrite:true});
		}

		if(!game1Data.lock_arr[n].bg.unlock){
			game1Data.lock_arr[n].success.y = game1Data.lock_arr[n].top.y = game1Data.lock_arr[n].bottom.y;
		}
	}
}

/*!
 *
 * Draw Locks - This is the function that runs to draw locks
 *
 */
function drawLocks(total){
	game1Data.lock_arr = []
	game1Data.lockSeq_arr = [];
	game1Data.lockNum = 0;
	game1LockContainer.removeAllChildren();

	var startX = canvasW/100 * 52;
	var startY = canvasH/100 * 63;
	var curX = startX;
	var pinStrikeH = 10;

	var pinW = 40;
	var pinSpace = 55;
	var level_arr = [60,90,70,50,80,30,65,85,95];
	shuffle(level_arr);

	for(var n=0; n<total; n++){
		var extraBgSpace = 20;
		var newLockBg = new createjs.Shape();
		newLockBg.graphics.beginFill(pinBgColor);
		newLockBg.graphics.moveTo((pinW/2)+5, -(extraBgSpace)).lineTo((pinW/2)+5, -(pinBgHeight)).lineTo(-((pinW/2)+5), -(pinBgHeight)).lineTo(-((pinW/2)+5), -(extraBgSpace));
		newLockBg.graphics.endFill();

		var newLockBottom = new createjs.Shape();
		newLockBottom.graphics.beginFill(pinBottomColor);
		newLockBottom.graphics.moveTo(0,0).lineTo(pinW/2, -(pinStrikeH)).lineTo(pinW/2, -(level_arr[n])).lineTo(-(pinW/2), -(level_arr[n])).lineTo(-(pinW/2), -(pinStrikeH));
		newLockBottom.graphics.endFill();

		var spaceBottom = -(level_arr[n] + 10);
		var newLockTop = new createjs.Shape();
		newLockTop.graphics.beginFill(pinTopColor);
		newLockTop.graphics.moveTo(pinW/2, spaceBottom).lineTo(pinW/2, spaceBottom-(pinHeight - (level_arr[n]))).lineTo(-(pinW/2), spaceBottom-(pinHeight - (level_arr[n]))).lineTo(-(pinW/2), spaceBottom);
		newLockTop.graphics.endFill();

		var successLock = new createjs.Shape();
		successLock.graphics.beginFill(pinSuccessColor);
		successLock.graphics.moveTo(pinW/2, spaceBottom).lineTo(pinW/2, spaceBottom-(pinHeight - (level_arr[n]))).lineTo(-(pinW/2), spaceBottom-(pinHeight - (level_arr[n]))).lineTo(-(pinW/2), spaceBottom);
		successLock.graphics.endFill();
		successLock.visible = false;

		newLockBg.x = successLock.x = newLockBottom.x = newLockTop.x = curX;
		newLockBg.y = successLock.y = newLockBottom.y = newLockTop.y = startY;
		game1Data.lock_arr.push({bg:newLockBg, bottom:newLockBottom, top:newLockTop, success:successLock, y:startY, space:level_arr[n]});
		game1Data.lockSeq_arr.push(n);

		newLockBg.unlock = false;
		newLockBg.cursor = "pointer";
		newLockBg.clickNum = n;
		newLockBg.addEventListener("click", function(evt) {
			moveLockPicker(evt);
			toggleUnlock(evt.target.clickNum);
		});

		curX+= pinSpace;
		game1LockContainer.addChild(newLockBg, newLockTop, successLock, newLockBottom);
	}
}

/*!
 *
 * toggle unlock - This is the function that runs to toggle unlock
 *
 */
function toggleUnlock(n){
	if(!gameData.paused){
		hideInstruction();

		var randomNum = Math.floor(Math.random()*2)+1;
		playSound('soundPin'+randomNum);

		var rotateSpeed = .1;
		TweenMax.to(itemPin, rotateSpeed, {rotation:-3, overwrite:true, onComplete:function(){
			TweenMax.to(itemPin, rotateSpeed, {rotation:0, overwrite:true, onComplete:function(){
				TweenMax.to(itemPin, rotateSpeed, {rotation:-3, overwrite:true, onComplete:function(){
					TweenMax.to(itemPin, rotateSpeed, {rotation:0, overwrite:true});
				}});
			}});
		}});

		if(game1Data.lockSeq_arr[game1Data.lockNum] == n){
			playSound('soundBonus');
			var newY = game1Data.lock_arr[n].y - (pinHeight - game1Data.lock_arr[n].space);
			var ySpeed = .3;
			TweenMax.to(game1Data.lock_arr[n].success, ySpeed, {y:newY, overwrite:true});
			TweenMax.to(game1Data.lock_arr[n].top, ySpeed, {y:newY, overwrite:true});

			game1Data.lock_arr[n].bg.unlock = true;
			game1Data.lock_arr[n].success.visible = true;

			game1Data.lockNum++;
			if(game1Data.lockNum > game1Data.lock_arr.length-1){
				playSound('soundDoorUnlock');
				prepareNextGame();
			}
		}else{
			//reset
			for(var n=0; n<game1Data.lock_arr.length; n++){
				game1Data.lock_arr[n].success.visible = false;
				game1Data.lock_arr[n].bg.unlock = false;
			}
			game1Data.lockNum = 0;
		}
	}
}

/*!
 *
 * GAME 2 - This is the function that runs to setup game 2
 *
 */
 function setupCombinationButton(){
	itemCombination1.cursor = "pointer";
	itemCombination1.addEventListener("mousedown", handlerCombiMethod);
	itemCombination1.addEventListener("pressmove", handlerCombiMethod);
	itemCombination1.addEventListener("pressup", handlerCombiMethod);
 }

function removeCombinationButton(){
	itemCombination1.cursor = null;
	itemCombination1.removeEventListener("mousedown", handlerCombiMethod);
	itemCombination1.removeEventListener("pressmove", handlerCombiMethod);
	itemCombination1.removeEventListener("pressup", handlerCombiMethod);
}

function handlerCombiMethod(evt) {
	 switch (evt.type){
		 case 'mousedown':
		 	game2Data.cRotation = setDirection(gameData.stageX, gameData.stageY, itemCombination2.x, itemCombination2.y);
			game2Data.cRotation = convertRotate(game2Data.cRotation);
			game2Data.rotation = convertRotate(itemCombination2.rotation);
		 	break;

		 case 'pressmove':
		 	hideInstruction();
		 	var rads = Math.atan2(gameData.stageY - itemCombination1.y, gameData.stageX - itemCombination1.x);
		  	var angle = rads * (180 / Math.PI);
			angle = convertRotate(angle+90);
		  	itemCombination2.rotation = itemCombiPoint.rotation = game2Data.rotation+((angle)-game2Data.cRotation);

			getDirection(Math.floor(angle));
			game2Data.angle = Math.floor(angle);

			if(!game2Data.detect){
				game2Data.detect = true;
				game2Data.turnNum = 50;
			}
		 	break;

		 case 'pressup':

		 	break;
	 }
}

function getDirection(angle){
	if(game2Data.angle <= 10 && angle >= 350){
		return;
	}else if(game2Data.angle >= 350 && angle <= 10){
		return;
	}else if(game2Data.angle == angle){
		return;
	}

	if(game2Data.angle > angle){
		game2Data.direction = false;
	}else if(game2Data.angle <= angle){
		game2Data.direction = true;
	}
}

function convertRotate(angle){
	if(angle<0){
		 angle = 180+(angle + 180);
	}
	return angle;
}

function setDirection(x1, y1, x2, y2) {
    var radiance = 180/Math.PI;
    var walkdirection = -(Math.atan2(x2-x1, y2-y1))*radiance;
    return walkdirection;
}

/*!
 *
 * CREATE COMBINATION LIGHTS - This is the function that runs to create combination lights
 *
 */
function createCombiLights(total){
	itemCombination2.rotation = 0;

	game2Data.turnNum = 0;
	game2Data.detect = true;
	game2Data.seqNum = 0;
	game2Data.seq_arr = [];
	game2Data.angle_arr = [];
	game2LightContainer.removeAllChildren();

	var numGrant = 15;
	var divideNum = Math.floor(24/total);

	for(var n=0; n<total; n++){
		var thisAngle = Math.floor(Math.random()*divideNum);
		thisAngle += (n*divideNum);

		game2Data.angle_arr.push(numGrant*thisAngle);
	}

	shuffle(game2Data.angle_arr);
	var direction = randomBoolean();
	var startX = canvasW/100 * 20;
	var startY = canvasH/2;
	var lightSpace = 65;
	var curY = startY - ((lightSpace * total)/2);
	curY += lightSpace/2;

	for(var n=0; n<total; n++){
		var lightButton = itemLightAnimate.clone();
		lightButton.x = startX;
		lightButton.y = curY;
		lightButton.gotoAndStop('off');
		curY += lightSpace;

		var lightText = new createjs.Text();
		lightText.font = "22px caviar_dreamsbold";
		lightText.color = "#fff";
		lightText.textAlign = "center";
		lightText.textBaseline='alphabetic';
		lightText.text = '';
		lightText.x = lightButton.x;
		lightText.y = lightButton.y+10;

		game2Data.seq_arr.push({rotate:game2Data.angle_arr[n], direction:direction, obj:lightButton, text:lightText});
		direction = direction == true ? false : true;

		game2LightContainer.addChild(lightButton, lightText);
	}
}

/*!
 *
 * DETECT LEVEL - This is the function that runs to detect level
 *
 */
function detectLevel(){
	var levelHeight = 0;
	var extraLevel = Math.floor(Math.random()*20);

	if(game2Data.turnNum >= 0){
		game2Data.turnNum--;
	}

	if(game2Data.turnNum <= 0){
		if(game2Data.seqNum < game2Data.seq_arr.length && game2Data.detect){
			var curAngle = itemCombination2.rotation;
			var curSeq = game2Data.seq_arr[game2Data.seqNum].rotate;

			setAnglePosition(itemCombiPixel, itemCombination2.x, itemCombination2.y, 170, curSeq-90);
			setAnglePosition(itemCombiPoint, itemCombination2.x, itemCombination2.y, 100, curAngle-90);

			var distance = Math.abs(70 - getDistance(itemCombiPixel, itemCombiPoint));
			var detectDistance = 120;

			//if(game2Data.direction == game2Data.seq_arr[game2Data.seqNum].direction){
				if(Math.abs(distance) <= detectDistance){
					levelHeight = Math.floor(detectDistance - Math.abs(distance));
					levelHeight = (levelHeight/detectDistance) * 80;
					if(Math.abs(distance) <= 2){
						levelHeight = 98;
					}

					if(Math.abs(distance) == 0){
						if(game2Data.detectNum <= 0){
							playSound('soundSafeUnlockIndividual');
							playSound('soundBonus');

							game2Data.detect = false;
							game2Data.seq_arr[game2Data.seqNum].obj.gotoAndStop('on');

							var negativeString = game2Data.seq_arr[game2Data.seqNum].direction ? '' : '-';
							game2Data.seq_arr[game2Data.seqNum].text.text = negativeString+combiNumber_arr[curSeq/15];
							game2Data.seqNum++;
							game2Data.direction = game2Data.direction == true ? false : game2Data.direction;

							if(game2Data.seqNum > game2Data.seq_arr.length-1){
								playSound('soundSafeUnlock');
								prepareNextGame();
							}
						}else{
							game2Data.detectNum--;
						}
					}else{
						game2Data.detectNum = 50;
					}
				}
			//}else{
				//reset
				/*game2Data.detect = false;
				game2Data.seqNum = 0;
				for(var n=0; n<game2Data.seq_arr.length; n++){
					if(game2Data.seq_arr[n].obj.currentFrame == 1){
						playSound('soundLock');
					}
					game2Data.seq_arr[n].obj.gotoAndStop('off');
					game2Data.seq_arr[n].text.text = '';
				}
				TweenMax.to(itemCombiPixel, .3, {overwrite:true, onComplete:function(){
					game2Data.detect = true;
				}});*/
			//}
		}
	}

	levelHeight += extraLevel;
	levelHeight = levelHeight > 100 ? 100 : levelHeight;

	TweenMax.to(game2Data, .5, {levelNum:combinationLevelH/100 * (levelHeight), overwrite:true, onUpdate:adjustLevel, onUpdateParams:[game2Data.levelNum]});
}

function adjustLevel(level){
	itemCombiLevel.graphics.clear();
	itemCombiLevel.graphics.beginFill(combinationLevelColor);
	itemCombiLevel.graphics.drawRect(-(combinationLevelW/2), -(level), combinationLevelW, level);
	itemCombiLevel.graphics.endFill();

	itemCombiLevel.x = canvasW/100*81.2;
	itemCombiLevel.y = canvasH/100*77;

	setSoundVolume('soundPowerLoop', level/combinationLevelH * 1)
}

function setAnglePosition(obj, x1, y1, radius, angle){
    obj.x = x1 + radius * Math.cos(angle * Math.PI/180)
    obj.y = y1 + radius * Math.sin(angle * Math.PI/180)
}

/*!
 *
 * GAME 3 - This is the function that runs to setup game 3
 *
 */
function insertCard(){
	animateCard();
}

function animateCard(){
	playSound('soundCard');
	itemCard.y = itemCard.oriY;
	TweenMax.to(itemCard, .5, {y:itemCard.oriY - 160, overwrite:true, onComplete:function(){
		generateButtonSeq();
	}});
}

/*!
 *
 * CREATE PHONE BUTTONS - This is the function that runs to create phone buttons
 *
 */
function createPhoneButtons(){
	game3Data.totalPin = 0;
	game3Data.ready = false;
	game3Data.button_arr = [];
	game3Data.number_arr = [];
	game3Data.seq_arr = [];
	game3Data.num = 0;
	game3Data.clickNum = 0;
	game3ButtonContainer.removeAllChildren();

	itemCardLightAnimate.gotoAndStop('off');
	for(var n=0; n<4; n++){
		$.password[n].gotoAndStop('off');
	}

	var startX = canvasW/100 * 61;
	var startY = canvasH/100 * 55;
	var spaceX = 110;
	var spaceY = 80;
	var curX = startX;
	var curY = startY;

	var countB = 0;

	for(var n=0; n<9; n++){
		var newButton = itemButtonAnimate.clone();
		newButton.clickNum = n;
		newButton.x = curX;
		newButton.y = curY;
		newButton.gotoAndStop('off');

		curX += spaceX;
		countB++;

		if(countB > 2){
			countB = 0;
			curY += spaceY;
			curX = startX;
		}

		newButton.cursor = "pointer";
		newButton.addEventListener("click", function(evt) {
			buttonClick(evt.target);
		});

		game3Data.number_arr.push(n);
		game3Data.button_arr.push(newButton);
		game3ButtonContainer.addChild(newButton);
	}
}

function buttonClick(obj){
	if(game3Data.ready){
		hideInstruction();
		animateButton(obj.clickNum, .3);
		if(obj.clickNum == game3Data.seq_arr[game3Data.clickNum]){
			game3Data.clickNum++;

			if(game3Data.clickNum >= game3Data.totalStep){
				unlockPassword();
			}
		}else{
			playSound('soundAtmReset');
			game3Data.ready = false;
			TweenMax.to(itemCard, 1, {overwrite:true, onComplete:startAnimateButton});
		}
	}
}

/*!
 *
 * GENERATE BUTTON SEQ - This is the function that runs to generate button seq
 *
 */
function generateButtonSeq(){
	game3Data.seq_arr = [];
	for(var n=0; n<game3Data.totalStep; n++){
		shuffle(game3Data.number_arr);
		game3Data.seq_arr.push(game3Data.number_arr[0]);
	}
	startAnimateButton();
}

function startAnimateButton(){
	game3Data.ready = false;
	game3Data.animateNum = 0;
	game3Data.clickNum = 0;
	loopAnimateButton();
}

function loopAnimateButton(){
	animateButton(game3Data.seq_arr[game3Data.animateNum], .2);
	game3Data.animateNum++;
	if(game3Data.animateNum < game3Data.seq_arr.length){
		TweenMax.to(itemCard, .3, {overwrite:true, onComplete:loopAnimateButton});
	}else{
		game3Data.ready = true;
	}
}

function animateButton(num, speed){
	playSound('soundAtmButton');
	game3Data.button_arr[num].gotoAndStop('on');
	TweenMax.to(game3Data.button_arr[num], speed, {alpha:1, overwrite:true, onComplete:function(){
		game3Data.button_arr[num].gotoAndStop('off');
	}});
}

/*!
 *
 * UNLOCK PASSWORD - This is the function that runs to unlock password
 *
 */
function unlockPassword(){
	playSound('soundBonus');
	$.password[game3Data.totalPin].gotoAndStop('on');
	game3Data.totalPin++;

	if(game3Data.totalPin > 3){
		itemCardLightAnimate.gotoAndStop('on');
		prepareNextGame();
	}else{
		TweenMax.to(itemCard, 1, {overwrite:true, onComplete:generateButtonSeq});
	}
}

 /*!
 *
 * GAME 4 - This is the function that runs to setup game 4
 *
 */
function createWires(total){
	game4Data.seq_arr = [];
	game4Data.connect_arr = [];
	game4Data.lines_arr = [];
	game4Data.lineNum = 0;

	game4WireContainer.removeAllChildren();
	game4ConnectContainer.removeAllChildren();

	var startX = canvasW/100 * 22;
	var startY = canvasH/2;
	var endX = canvasW/100 * 82;
	var connectSpace = 80;
	var curY = startY - ((connectSpace * total)/2);
	curY += connectSpace/2;

	for(var n=0; n<total; n++){
		var connectStart = itemConnectStart.clone();
		var connectEnd = itemConnectEndAnimate.clone();
		var connector = itemConnector.clone();
		connectEnd.gotoAndStop('off');
		connectEnd.connected = false;
		connectEnd.lineNum = n;

		connectStart.x = startX;
		connectEnd.x = endX;
		connectStart.y = connectEnd.y = curY;

		connector.lineNum = n;
		connector.extraNum = randomIntFromInterval(-20,20);
		connector.x = randomIntFromInterval(canvasW/100* 40, canvasW/100* 70);
		connector.y = randomIntFromInterval(canvasH/100* 30, canvasH/100* 70);
		connector.connected = null;
		connector.cursor = "pointer";
		connector.addEventListener("mousedown", function(evt) {
			toggleDragEvent(evt, 'drag')
		});
		connector.addEventListener("pressmove", function(evt) {
			toggleDragEvent(evt, 'move')
		});
		connector.addEventListener("pressup", function(evt) {
			toggleDragEvent(evt, 'drop')
		});

		createLines(startX, curY, connector.x, connector.y);

		curY += connectSpace;

		game4Data.seq_arr.push(n);
		game4Data.connect_arr.push({start:connectStart, end:connectEnd, connector:connector, connected:false});
		game4ConnectContainer.addChild(connectStart, connectEnd);
		game4WireContainer.addChild(connector);

		adjustCenterPoint(n);
	}

	shuffle(game4Data.seq_arr);
}

function toggleDragEvent(obj, con){
	if(gameData.paused){
		return;
	}

	switch(con){
		case 'drag':
			obj.target.offset = {x:obj.target.x-(obj.stageX), y:obj.target.y-(obj.stageY)};
			if(obj.target.connected != null){
				playSound('soundConnectOut');
				obj.target.connected.gotoAndStop('off');
				obj.target.connected.connected = false;
				obj.target.connected = null;
			}
		break;

		case 'move':
			hideInstruction();
			obj.target.x = (obj.stageX) + obj.target.offset.x;
			obj.target.y = (obj.stageY) + obj.target.offset.y;

			dragWithinArea(obj.target, canvasW/100 * 25, canvasW/100 * 70, canvasH/100 * 20, canvasH/100 * 80);
			adjustCenterPoint(obj.target.lineNum);
		break;

		case 'drop':
			checkConnector(obj.target);
		break;
	}
}

/*!
 *
 * DRAW LINES - This is the function that runs to draw lines
 *
 */
function createLines(startX, startY, endX, endY){
	game4Data.lines_arr.push({lines:[], drawLine:0});

	addPoint(startX, startY, true);
	addPoint(startX, startY, false);
	addPoint(startX, startY, false);
	addPoint(startX, startY, false);
	addPoint(endX, endY, true);

	game4Data.lines_arr[game4Data.lineNum].drawLine = new createjs.Shape();
	game4WireContainer.addChild(game4Data.lines_arr[game4Data.lineNum].drawLine);

	game4Data.lineNum++;
}

function addPoint(x, y, drag){
	var newPoint = new createjs.Shape();
	newPoint.x = x;
	newPoint.y = y;
	newPoint.lineNum = game4Data.lineNum;
	game4Data.lines_arr[game4Data.lineNum].lines.push({point:newPoint});
	game4WireContainer.addChild(newPoint);
}

/*!
 *
 * CHECK CONNECTOR - This is the function that runs to check connector
 *
 */
function checkConnector(connector){
	var rangeXNum = 100;
	var rangeYNum = 30;

	for(var n=0; n<game4Data.connect_arr.length;n++){
		var targetEnd = game4Data.connect_arr[n].end;

		if(!targetEnd.connected){
			if(connector.x + 100 >= targetEnd.x - rangeXNum && connector.x + 100 <= targetEnd.x + rangeXNum){
				if(connector.y >= targetEnd.y - rangeYNum && connector.y <= targetEnd.y + rangeYNum){
					playSound('soundConnectIn');
					targetEnd.connected = true;

					if(connector.lineNum == game4Data.seq_arr[targetEnd.lineNum]){
						playSound('soundBonus');
						targetEnd.gotoAndStop('on');
						checkAllConnected();
					}

					connector.x = targetEnd.x - 160;
					connector.y = targetEnd.y;
					connector.connected = targetEnd;

					adjustCenterPoint(connector.lineNum);
					n = game4Data.connect_arr.length;
				}
			}
		}
	}
}

function adjustCenterPoint(lineNum){
	var startPoint = game4Data.lines_arr[lineNum].lines[0].point;
	var startCurvePoint = game4Data.lines_arr[lineNum].lines[1].point;
	var centerPoint = game4Data.lines_arr[lineNum].lines[2].point;
	var endCurvePoint = game4Data.lines_arr[lineNum].lines[3].point;
	var endPoint = game4Data.lines_arr[lineNum].lines[4].point;
	var extraNum = game4Data.connect_arr[lineNum].connector.extraNum;

	endPoint.x = game4Data.connect_arr[lineNum].connector.x;
	endPoint.y = game4Data.connect_arr[lineNum].connector.y;

	startCurvePoint.x = startPoint.x + ((endPoint.x - startPoint.x)/100 * 30);
	startCurvePoint.y = startPoint.y - ((endPoint.y - startPoint.y)/100 * (50+extraNum));

	centerPoint.x = startPoint.x + ((endPoint.x - startPoint.x)/2);
	centerPoint.y = startPoint.y + ((endPoint.y - startPoint.y)/2);

	endCurvePoint.x = startPoint.x + ((endPoint.x - startPoint.x)/100 * 70);
	endCurvePoint.y = endPoint.y + ((endPoint.y - startPoint.y)/100 * (50+extraNum));

	redrawLine();
}

function checkAllConnected(){
	var connectCount = 0;
	for(var n=0; n<game4Data.connect_arr.length;n++){
		var targetEnd = game4Data.connect_arr[n].end;
		if(targetEnd.currentFrame == 1){
			connectCount++;
		}
	}

	if(connectCount == game4Data.totalCable){
		prepareNextGame();
	}
}

/*!
 *
 * REDRAW LINES - This is the function that runs to redraw lines
 *
 */
function redrawLine(){
	for(var n=0; n<game4Data.lines_arr.length; n++){
		game4Data.lines_arr[n].drawLine.graphics.clear();
		game4Data.lines_arr[n].drawLine.graphics.setStrokeStyle(cableStroke);
		game4Data.lines_arr[n].drawLine.graphics.beginStroke(cableColor);

		game4Data.lines_arr[n].drawLine.graphics.moveTo(game4Data.lines_arr[n].lines[0].point.x, game4Data.lines_arr[n].lines[0].point.y);
		for(var p=0; p<game4Data.lines_arr[n].lines.length; p++){
			if(game4Data.lines_arr[n].lines.length - p > 2 && isEven(p)){
				game4Data.lines_arr[n].drawLine.graphics.curveTo(game4Data.lines_arr[n].lines[p+1].point.x, game4Data.lines_arr[n].lines[p+1].point.y, game4Data.lines_arr[n].lines[p+2].point.x, game4Data.lines_arr[n].lines[p+2].point.y);
			}
		}
	}
}

/*!
 *
 * TOGGLE GAME TIMER - This is the function that runs to toggle game timer
 *
 */
function toggleGameTimer(con, total){
	if(con){
		gameData.timerTotal = total;
		gameData.timerStart = new Date();
	}else{
		gameData.timerSound = false;
	}
	gameData.timerEnable = con;
}

function drawTimerBar(con){
	timerBgBar.graphics.clear();
	timerBgBar.graphics.beginFill(timerBgBarColor);
	timerBgBar.graphics.drawRect(0, 0, stageW, timerBarH);
	timerBgBar.graphics.endFill();

	var currentW = canvasW - (offset.x);
	var timerCount = gameData.timerTotal - gameData.timerCount;
	var newWidth = timerCount / gameData.timerTotal * currentW;
	if(!con){
		newWidth = currentW;
	}

	timerBar.graphics.clear();
	timerBar.graphics.beginFill(timerBarColor);
	timerBar.graphics.drawRect(0, 0, newWidth, timerBarH);
	timerBar.graphics.endFill();

	if(timerCount <= 10000 && con){
		if(!gameData.timerSound){
			gameData.timerSound = true;
			playSoundLoop('soundTimer');
			animateObject(timerBar, true, true);
		}
	}

	if(newWidth <= 0){
		goPage('result');
	}
}

/*!
 *
 * UPDATE GAME - This is the function that runs to loop game update
 *
 */
function updateGame(){
	if(gameData.timerEnable){
		var nowDate = new Date();
		gameData.timerCount = (nowDate.getTime() - gameData.timerStart.getTime());
		drawTimerBar(true);
	}

	if(gameData.type == 1){
		//game 1
		checkWithinLockArea(gameData.stageX);
	}else if(gameData.type == 2){
		//game 2
		detectLevel();
	}
}


/*!
 *
 * OPTIONS - This is the function that runs to mute and fullscreen
 *
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/*!
 *
 * SHARE - This is the function that runs to open share url
 *
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);

	var title = '';
	var text = '';

	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	var shareurl = '';

	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}

	window.open(shareurl);
}
