function CInterface(){
    var _oAudioToggle;
    var _oButExit;
    var _oScoreText;
    var _oScoreText1;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    
    this._init = function(){                
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2)- 90;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        _oScoreText = new createjs.Text("0 pt"," 40px "+FONT, "#8836b6");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = CANVAS_WIDTH/2-180;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "middle";
        _oScoreText.lineWidth = 500;   
        _oScoreText.outline = 5;
        
        _oScoreText1 = new createjs.Text("0 pt"," 40px "+FONT, "#fd83d3");
        _oScoreText1.x = CANVAS_WIDTH/2;
        _oScoreText1.y = CANVAS_WIDTH/2-180;
        _oScoreText1.textAlign = "center";
        _oScoreText1.textBaseline = "middle";
        _oScoreText1.lineWidth = 500;        
        
        s_oStage.addChild(_oScoreText, _oScoreText1);
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        } 
        
    };
    
    this.viewScore = function(iValue){
        _oScoreText.text = iValue+" pt";
        _oScoreText1.text = iValue+" pt";
        createjs.Tween.get( _oScoreText ).to({scaleX: 1.2, scaleY: 1.2 }, (200), createjs.Ease.cubicOut ).call(function( ) {
            createjs.Tween.get( _oScoreText ).to({scaleX: 1, scaleY: 1}, (200), createjs.Ease.cubicIn ).call(function( ) {
            }); 
        });    
        createjs.Tween.get( _oScoreText1 ).to({scaleX: 1.2, scaleY: 1.2 }, (200), createjs.Ease.cubicOut ).call(function( ) {
            createjs.Tween.get( _oScoreText1 ).to({scaleX: 1, scaleY: 1}, (200), createjs.Ease.cubicIn ).call(function( ) {
            }); 
        });  
    };
    
    
    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;