////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/button_begin.png', id:'buttonBegin'},
			
			{src:'assets/instruct1.png', id:'gameInstruction1'},
			{src:'assets/instruct2.png', id:'gameInstruction2'},
			{src:'assets/instruct3.png', id:'gameInstruction3'},
			{src:'assets/instruct4.png', id:'gameInstruction4'},
			
			{src:'assets/unlock.png', id:'gameUnlock'},
			{src:'assets/unlock_bg.png', id:'gameUnlockBg'},
			{src:'assets/game_loader.png', id:'gameLoader'},
			
			{src:'assets/game_layout1.png', id:'game1'},
			{src:'assets/item_lock_pick.png', id:'itemPin'},
			
			{src:'assets/game_layout2.png', id:'game2'},
			{src:'assets/item_combination_1.png', id:'itemCombination1'},
			{src:'assets/item_combination_2.png', id:'itemCombination2'},
			{src:'assets/item_light.png', id:'itemLight'},
			
			{src:'assets/game_layout3.png', id:'game3'},
			{src:'assets/item_button.png', id:'itemButton'},
			{src:'assets/item_card.png', id:'itemCard'},
			{src:'assets/item_card_light.png', id:'itemCardLight'},
			{src:'assets/item_password.png', id:'itemPassword'},
			
			{src:'assets/game_layout4.png', id:'game4'},
			{src:'assets/item_connect_start.png', id:'itemConnectStart'},
			{src:'assets/item_connect_end.png', id:'itemConnectEnd'},
			{src:'assets/item_connector.png', id:'itemConnector'},
			
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_google.png', id:'buttonGoogle'},
			{src:'assets/button_replay.png', id:'buttonReplay'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'}];
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/musicGame.ogg', id:'musicGame'});
		manifest.push({src:'assets/sounds/bonus.ogg', id:'soundBonus'});
		manifest.push({src:'assets/sounds/door_unlock.ogg', id:'soundDoorUnlock'});
		manifest.push({src:'assets/sounds/success.ogg', id:'soundSuccess'});
		manifest.push({src:'assets/sounds/fail.ogg', id:'soundFail'});
		manifest.push({src:'assets/sounds/pin1.ogg', id:'soundPin1'});
		manifest.push({src:'assets/sounds/pin2.ogg', id:'soundPin2'});
		manifest.push({src:'assets/sounds/pin3.ogg', id:'soundPin3'});
		manifest.push({src:'assets/sounds/lock.ogg', id:'soundLock'});
		manifest.push({src:'assets/sounds/safe_unlock.ogg', id:'soundSafeUnlock'});
		manifest.push({src:'assets/sounds/safe_unlock_individual.ogg', id:'soundSafeUnlockIndividual'});
		manifest.push({src:'assets/sounds/soundPowerLoop.ogg', id:'soundPowerLoop'});
		manifest.push({src:'assets/sounds/insert_card.ogg', id:'soundCard'});
		manifest.push({src:'assets/sounds/atm_button.ogg', id:'soundAtmButton'});
		manifest.push({src:'assets/sounds/atm_reset.ogg', id:'soundAtmReset'});
		manifest.push({src:'assets/sounds/connect_in.ogg', id:'soundConnectIn'});
		manifest.push({src:'assets/sounds/connect_out.ogg', id:'soundConnectOut'});
		manifest.push({src:'assets/sounds/soundTimer.ogg', id:'soundTimer'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}