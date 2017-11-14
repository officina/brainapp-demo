////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, resultContainer;
var guideline, bg, logo, buttonBegin, buttonReplay, buttonFacebook, buttonTwitter, buttonGoogle, buttonFullscreen, buttonSoundOn, buttonSoundOff;
$.password = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	game1Container = new createjs.Container();
	game2Container = new createjs.Container();
	game3Container = new createjs.Container();
	game4Container = new createjs.Container();
	instructionContainer = new createjs.Container();
	loaderContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	buttonBegin = new createjs.Bitmap(loader.getResult('buttonBegin'));
	centerReg(buttonBegin);
	buttonBegin.x = canvasW/2;
	buttonBegin.y = canvasH/100 * 75;
	
	//game 1
	game1LockContainer = new createjs.Container();
	game1 = new createjs.Bitmap(loader.getResult('game1'));
	
	itemPin = new createjs.Bitmap(loader.getResult('itemPin'));
	centerReg(itemPin);
	itemPin.regY = 21;
	
	game1Container.addChild(game1, itemPin, game1LockContainer, itemPin);
	
	//game2
	game2 = new createjs.Bitmap(loader.getResult('game2'));
	game2LightContainer = new createjs.Container();
	itemCombination1 = new createjs.Bitmap(loader.getResult('itemCombination1'));
	itemCombination2 = new createjs.Bitmap(loader.getResult('itemCombination2'));
	centerReg(itemCombination1);
	centerReg(itemCombination2);
	
	itemCombination1.x = canvasW/100 * 50;
	itemCombination1.y = canvasH/100 * 50;
	itemCombination2.x = itemCombination1.x;
	itemCombination2.y = itemCombination1.y;
	
	var _frameW=128;
	var _frameH=52;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {off:{frames: [0], speed:1},
						on:{frames: [1], speed:1}};
						
	itemLightData = new createjs.SpriteSheet({
		"images": [loader.getResult("itemLight").src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemLightAnimate = new createjs.Sprite(itemLightData, "off");
	itemLightAnimate.framerate = 20;
	itemLightAnimate.x = -100;
	
	itemCombiPixel = new createjs.Shape();
	itemCombiPixel.graphics.beginFill(combinationLevelColor);
	itemCombiPixel.graphics.drawRect(-5, -5, 10, 10);
	itemCombiPixel.graphics.endFill();
	
	itemCombiPoint = new createjs.Shape();
	itemCombiPoint.graphics.beginFill(combinationLevelColor);
	itemCombiPoint.graphics.drawRect(-5, -5, 10, 10);
	itemCombiPoint.graphics.endFill();
	itemCombiPoint.visible = itemCombiPixel.visible = false;
	
	itemCombiLevel = new createjs.Shape();
	
	game2Container.addChild(game2, itemCombiLevel, itemCombiPixel, itemLightAnimate, game2LightContainer, itemCombination1, itemCombination2, itemCombiPoint);
	
	//game3
	game3 = new createjs.Bitmap(loader.getResult('game3'));
	game3ButtonContainer = new createjs.Container();
	itemCard = new createjs.Bitmap(loader.getResult('itemCard'));
	itemCard.x = canvasW/100*22;
	itemCard.y = canvasH/100*30;
	itemCard.oriY = itemCard.y;
	
	itemCardMask = new createjs.Shape();
	itemCardMask.graphics.beginFill('black');
	itemCardMask.graphics.drawRect(0, 0, 300, 500);
	itemCardMask.graphics.endFill();
	
	itemCardMask.x = itemCard.x;
	itemCardMask.y = itemCard.y + 132;
	
	itemCard.mask = itemCardMask;
	
	var _frameW=90;
	var _frameH=67;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {off:{frames: [0], speed:1},
						on:{frames: [1], speed:1}};
						
	itemButtonData = new createjs.SpriteSheet({
		"images": [loader.getResult("itemButton").src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemButtonAnimate = new createjs.Sprite(itemButtonData, "off");
	itemButtonAnimate.framerate = 20;
	itemButtonAnimate.x = -100;
	
	var _frameW=89;
	var _frameH=46;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {off:{frames: [0], speed:1},
						on:{frames: [1], speed:1}};
						
	itemCardLightData = new createjs.SpriteSheet({
		"images": [loader.getResult("itemCardLight").src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemCardLightAnimate = new createjs.Sprite(itemCardLightData, "off");
	itemCardLightAnimate.framerate = 20;
	itemCardLightAnimate.x = canvasW/100 * 21;
	itemCardLightAnimate.y = canvasH/100 * 32;
	
	var _frameW=33;
	var _frameH=36;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {off:{frames: [0], speed:1},
						on:{frames: [1], speed:1}};
						
	itemPasswordData = new createjs.SpriteSheet({
		"images": [loader.getResult("itemPassword").src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemPasswordAnimate = new createjs.Sprite(itemPasswordData, "off");
	itemPasswordAnimate.framerate = 20;
	itemPasswordAnimate.x = -100;
	
	game3Container.addChild(game3, itemCard, itemCardLightAnimate, itemPasswordAnimate, itemButtonAnimate, game3ButtonContainer);
	
	var startX = canvasW/100 * 63.5;
	var startY = canvasW/100 * 26;
	for(var n=0;n<4;n++){
		var newPassword = itemPasswordAnimate.clone();
		
		newPassword.x = startX;
		newPassword.y = startY;
		startX += 50;
		
		$.password[n] = newPassword;
		game3Container.addChild(newPassword);	
	}
	
	//game4
	game4 = new createjs.Bitmap(loader.getResult('game4'));
	game4WireContainer = new createjs.Container();
	game4ConnectContainer = new createjs.Container();
	
	itemConnectStart = new createjs.Bitmap(loader.getResult('itemConnectStart'));
	centerReg(itemConnectStart);
	itemConnectStart.regX = 120;
	itemConnectStart.x = -200;
	
	itemConnector = new createjs.Bitmap(loader.getResult('itemConnector'));
	centerReg(itemConnector);
	itemConnector.regX = 5;
	itemConnector.x = -200;
	
	var _frameW=125;
	var _frameH=65;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {off:{frames: [0], speed:1},
						on:{frames: [1], speed:1}};
						
	itemConnectEndData = new createjs.SpriteSheet({
		"images": [loader.getResult("itemConnectEnd").src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemConnectEndAnimate = new createjs.Sprite(itemConnectEndData, "off");
	itemConnectEndAnimate.framerate = 20;
	itemConnectEndAnimate.x = -200;
	
	game4Container.addChild(game4, itemConnectStart, itemConnectEndAnimate, itemConnector, game4WireContainer, game4ConnectContainer);
	
	timerBgBar = new createjs.Shape();
	timerBar = new createjs.Shape();
	
	var _frameW=120;
	var _frameH=180;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {lock:{frames: [0], speed:1},
						animate:{frames: [0,0,0,1], speed:.2, next:'unlock'},
						unlock:{frames: [1], speed:1}};
						
	gameUnlockData = new createjs.SpriteSheet({
		"images": [loader.getResult("gameUnlock").src],
		"frames": _frame,
		"animations": _animations
	});
	
	gameUnlockAnimate = new createjs.Sprite(gameUnlockData, "lock");
	gameUnlockAnimate.framerate = 20;
	gameUnlockAnimate.x = canvasW/2;
	gameUnlockAnimate.y = canvasH/2;
	
	gameUnlockBg = new createjs.Bitmap(loader.getResult('gameUnlockBg'));
	
	gameLoader = new createjs.Bitmap(loader.getResult('gameLoader'));
	loaderContainer.addChild(gameLoader);
	
	gameInstruction1 = new createjs.Bitmap(loader.getResult('gameInstruction1'));
	gameInstruction2 = new createjs.Bitmap(loader.getResult('gameInstruction2'));
	gameInstruction3 = new createjs.Bitmap(loader.getResult('gameInstruction3'));
	gameInstruction4 = new createjs.Bitmap(loader.getResult('gameInstruction4'));
	
	//result
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "50px caviar_dreamsbold";
	resultTitleTxt.color = "#fff";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = resultTitleText;
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 25;
	
	resultScoreTxt = new createjs.Text();
	resultScoreTxt.font = "120px caviar_dreamsbold";
	resultScoreTxt.color = "#51B9AD";
	resultScoreTxt.textAlign = "center";
	resultScoreTxt.textBaseline='alphabetic';
	resultScoreTxt.text = resultTitleText;
	resultScoreTxt.x = canvasW/2;
	resultScoreTxt.y = canvasH/100 * 42;
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "25px caviar_dreamsbold";
	resultShareTxt.color = "#DDDDDC";
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = shareText;
	resultShareTxt.x = canvasW/2;
	resultShareTxt.y = canvasH/100 * 55;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonGoogle = new createjs.Bitmap(loader.getResult('buttonGoogle'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonGoogle);
	createHitarea(buttonGoogle);
	buttonFacebook.x = canvasW/100*40;
	buttonFacebook.y = canvasH/100*62;
	buttonTwitter.x = canvasW/2;
	buttonTwitter.y = canvasH/100*62;
	buttonGoogle.x = canvasW/100*60;
	buttonGoogle.y = canvasH/100*62;
	
	buttonReplay = new createjs.Bitmap(loader.getResult('buttonReplay'));
	centerReg(buttonReplay);
	createHitarea(buttonReplay);
	buttonReplay.x = canvasW/2;
	buttonReplay.y = canvasH/100 * 75;
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(logo, buttonBegin);
	instructionContainer.addChild(gameInstruction1, gameInstruction2, gameInstruction3, gameInstruction4);
	gameContainer.addChild(game1Container, game2Container, game3Container, game4Container, instructionContainer, loaderContainer, gameUnlockBg, gameUnlockAnimate, timerBgBar, timerBar);
	resultContainer.addChild(resultTitleTxt, resultScoreTxt, buttonReplay);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonGoogle);
	}
	
	canvasContainer.addChild(bg, mainContainer, gameContainer, resultContainer, buttonFullscreen, buttonSoundOn, buttonSoundOff, guideline);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		timerBgBar.x = offset.x;
		timerBar.x = offset.x;
		timerBgBar.y = canvasH - (offset.y +timerBarH);
		timerBar.y = canvasH - (offset.y +timerBarH);
		
		buttonSoundOn.x = buttonSoundOff.x = canvasW - offset.x;
		buttonSoundOn.y = buttonSoundOff.y = offset.y;
		buttonSoundOn.x = buttonSoundOff.x -= 40;
		buttonSoundOn.y = buttonSoundOff.y += 30;
		
		buttonFullscreen.x = buttonSoundOn.x - 65;
		buttonFullscreen.y = buttonSoundOn.y;
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}