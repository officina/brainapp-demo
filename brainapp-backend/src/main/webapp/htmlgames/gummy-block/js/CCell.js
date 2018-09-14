function CCell(iRow,iCol,iX,iY,oParentContainer,istate){
    var _iRow;
    var _iCol;
    var _iX;
    var _iY;
    var _iValue;
    var _oSourceImage;
    var _oCell;
    var _oParticle;
    
    this._init = function(iRow,iCol,iX,iY,oParentContainer,istate){
        _iRow = iRow;
        _iCol = iCol;
        _iX = iX;
        _iY = iY;
        _oSourceImage = s_oSpriteLibrary.getSprite("cubes_sprite");
        
        var oData = {   
                        images: [_oSourceImage], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: CELL_WIDTH/2, regY: CELL_HEIGHT/2}, 
                        animations: {background:[0], form0:[1], form1:[2], form2:[3], form3:[4], form4:[5], form5:[6], form6:[7], form7:[8], form8:[9],hide:[10]}
                    };
                    
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        var oCellBg = createSprite(oSpriteSheet, "background", 0, 0, CELL_WIDTH, CELL_HEIGHT);
        oCellBg.x = iX;
        oCellBg.y = iY;
        oParentContainer.addChild(oCellBg);
        
        _oCell = createSprite(oSpriteSheet, "hide", 0, 0, CELL_WIDTH, CELL_HEIGHT);
        _oCell.x = iX;
        _oCell.y = iY;
        _iValue = istate;
        oParentContainer.addChild(_oCell);
    };
    
    this.changeCellState = function(iState){
        _oCell.gotoAndStop(iState);
        _iValue = iState;
    };
    
    this.changeScaleandState = function(){
        createjs.Tween.get( _oCell ).to({scaleX: 1.2, scaleY: 1.2 }, (300), createjs.Ease.cubicOut ).call(function( ) {
            createjs.Tween.get( _oCell ).to({scaleX: 0.1, scaleY: 0.1, alpha: 0.3 }, (300), createjs.Ease.cubicIn ).call(function( ) {
                this.gotoAndStop("hide");
                this.scaleX = 1;
                this.scaleY = 1;
                this.alpha = 1;
                _iValue = 0;
                s_oGame._setScore();
                //s_oGame.increaseConunterForCheckGameOver();
                s_oGame.decreaseCellToDeleteCounter();
            }); 
        });    
    };
    
    this.getValue = function(){
        return _iValue;
    };
    
    s_oCell = this;
    
    this._init(iRow,iCol,iX,iY,oParentContainer,istate);
    
}