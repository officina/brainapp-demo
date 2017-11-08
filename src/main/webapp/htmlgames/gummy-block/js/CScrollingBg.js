function CScrollingBg(oSprite, iX){
    var _oSpriteTile;
    var _oScrollingBg;
    
    this._init = function(oSprite, iX){
        _oSpriteTile = oSprite;
        _oScrollingBg = createBitmap(_oSpriteTile);
        s_oStage.addChild(_oScrollingBg); //Draws on canvas
        
        _oScrollingBg.x = iX;
        _oScrollingBg.y = 175;
        _oScrollingBg.regX = 0;
    };
    
    this.move = function(){      
        _oScrollingBg.x++;
        if(_oScrollingBg.x > CANVAS_WIDTH){
            _oScrollingBg.x = -SCROLLING_BG_WIDTH;
        }
    };
    
    this._init(oSprite, iX);
}