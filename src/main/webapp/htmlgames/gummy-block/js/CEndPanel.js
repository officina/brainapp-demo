function CEndPanel(oSpriteBg){

    var _oBg;
    var _oGroup;

    var _oMsgText;
    var _oScoreText;

    this._init = function(oSpriteBg){

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        _oMsgText = new createjs.Text(""," 60px "+FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-150;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 500;

        _oScoreText = new createjs.Text(""," 60px "+FONT, "#ffffff");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2) + 40;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 500;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;

        _oGroup.addChild(_oBg, _oScoreText, _oMsgText);

        s_oStage.addChild(_oGroup);
    };

    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
    };

    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };

    this.show = function(iScore){


        _oMsgText.text = TEXT_GAMEOVER;

        _oScoreText.text = TEXT_SCORE + iScore;

        _oGroup.visible = true;

        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});

        $(s_oMain).trigger("share_event",iScore);
        $(s_oMain).trigger("save_score",iScore);
    };

    this._onExit = function(){
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
        s_oGame.onExit();
    };

    this._init(oSpriteBg);

    return this;
}
