function CGame(oData){

    var _iScore = 0;
    var _iCurPos;
    var _iMouseOffset;
    var _iFormsOn = 0;
    var _iCheckGameOverAfterRowColDeleted = 0;
    var _iCellToDelete = 0;

    var _iRowColDeleted = 0;

    var _aDrag = new Array(false, false, false);

    var _oInterface;
    var _oEndPanel;

    var _bThereIsGameOver = false;
    var _bUpdate;
    var _bGameOverPlayed = false;

    var _oHelpPanel;
    var _oContainerGrid;
    var _aScrollingBg = new Array(2);

    var _aGrid;
    var _aNumColFree = new Array();
    var _aNumRowFree = new Array();
    var _aForm = new Array();


    this._init = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oSoundtrack.volume = 0.4;
        }
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas

        _aScrollingBg[0] = new CScrollingBg(s_oSpriteLibrary.getSprite('clouds_back'), 0);
        _aScrollingBg[1] = new CScrollingBg(s_oSpriteLibrary.getSprite('clouds_back'), -SCROLLING_BG_WIDTH);

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('cloud_mask'));
        s_oStage.addChild(oBg); //Draws on canvas

        _oInterface = new CInterface();
        _oContainerGrid = new createjs.Container();
        s_oStage.addChild(_oContainerGrid);

        var iX = START_X_GRID;
        var iY = START_Y_GRID;

        for(var i=0; i < NUM_ROWS; i++){
            _aNumColFree[i] = 10;
            _aNumRowFree[i] = 10;
        }

        //initializing the array
        _aGrid = new Array();
        for(var iRow=0; iRow < NUM_ROWS; iRow++){
            iY += CELL_HEIGHT + OFFSET_Y;
            _aGrid[iRow] = new Array();
            for(var iCol=0; iCol < NUM_COLS; iCol++){
                iX += CELL_WIDTH + OFFSET_X;
                _aGrid[iRow][iCol] = new CCell(iRow,iCol,iX,iY,_oContainerGrid, 0);
            }
            iX = START_X_GRID;
        }
        _bUpdate = false;

        _oHelpPanel = new CHelpPanel(s_oSpriteLibrary.getSprite('msg_box'));
    };

    this.setUpdateOn = function(){
        _bUpdate = true;
    };

    this._createForm = function (){
        for(var i = 0; i<3; i++){
            var iValue = Math.floor(Math.random() * (MAX_FORMS + 1));
            _aForm.push(new CForms(i, iValue));
            _iFormsOn++;
            _aForm[i].slideContainer();
        }
    };

    this.onFormContainerClick = function(event, oContainer, i){
        createjs.Tween.get(oContainer ).to({y: oContainer.y-150, scaleX: 1, scaleY: 1 }, (150), createjs.Ease.sineInOut).call(function() {});

        //TOUCH EVENTS
        _iCurPos = {x: oContainer.x, y: oContainer.y };
        _iMouseOffset = {x : event.stageX - _iCurPos.x, y : event.stageY - _iCurPos.y};
        _aDrag[i] = true;

    };

    this.dragForm = function(event, container, i){
        if(_aDrag[i] && _aForm[i] ){
           _aForm[i].setPos(event.stageX - _iMouseOffset.x , event.stageY - _iMouseOffset.y-150, container);
        }
    };

    this.releaseForm = function(event, container, startpos, iForm){
        var iFormContainer = iForm;
        var bControlGameOver = true;
        var iX = _aForm[iFormContainer].getPosX();
        var iY = _aForm[iFormContainer].getPosY();
        var c = Math.floor((iX-START_X_GRID)/(CELL_WIDTH+OFFSET_X));
        var r = Math.floor((iY-START_Y_GRID)/(CELL_HEIGHT+OFFSET_Y));
        var iFormToUse = {form: 0, type: 0};
        var aFormLogic = _aForm[iFormContainer].getFormArray();
        var iLeft;
        var iDown;
        var bPlaced = false;
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            createjs.Sound.play("position");
        }

        iFormToUse.form = _aForm[iFormContainer].getForm();
        switch(iFormToUse.form){
            case 9: case 12:
                iLeft = 3;
                iDown = 3;
                break;
            case 0:
                iLeft = 5;
                iDown = 1;
                break;
            case 1:
                iLeft = 1;
                iDown = 5;
                break;
            case 2:
                iLeft = 4;
                iDown = 1;
                break;
            case 3:
                iLeft = 1;
                iDown = 4;
                break;
            case 4:
                iLeft = 3;
                iDown = 1;
                break;
            case 5:
                iLeft = 1;
                iDown = 3;
                break;
            case 6:
                iLeft = 2;
                iDown = 1;
                break;
            case 7:
                iLeft = 1;
                iDown = 2;
                break;
            case 8: case 10:
                iLeft = 2;
                iDown = 2;
                break;
            case 11:
                iLeft = 1;
                iDown = 1;
                break;
        }

        if((iX >= START_X_GRID && iX < (START_X_GRID+((CELL_WIDTH+OFFSET_X)*10))) &&
           (iY >= START_Y_GRID && iY < (START_Y_GRID+(CELL_HEIGHT+OFFSET_Y)*10)+CELL_HEIGHT/2+OFFSET_Y)){

            if(this.checkPieceIfFitInPos(aFormLogic, r, c) === true){
                for ( var k = 0; k < aFormLogic.length; k++ ){
                    if( aFormLogic[k].sprite !== 0 ){
                        _aGrid[aFormLogic[k].y + r ][aFormLogic[k].x + c ].changeCellState(aFormLogic[k].sprite);
                        _aNumColFree[c+aFormLogic[k].x]--;
                        _aNumRowFree[r+aFormLogic[k].y]--;
                        _iScore+=SCORE_OBJECT_PLACED;

                        if(_aNumRowFree[r+aFormLogic[k].y] === 0){
                            bControlGameOver = false;
                            _iRowColDeleted++;
                            for(var i=0; i<NUM_COLS; i++){
                                if(_aNumColFree[i] === 0){
                                    _iRowColDeleted++;
                                    _aNumColFree[i] = 10;
                                    this.deleteCol(r+aFormLogic[k].y, i);
                                }
                            }
                            _aNumRowFree[r+aFormLogic[k].y] = 10;
                            this.deleteRow(r+aFormLogic[k].y, c+aFormLogic[k].x);
                        }
                        if(_aNumColFree[c+aFormLogic[k].x] === 0){
                            bControlGameOver = false;
                            _iRowColDeleted++;
                            for(var i=0; i<NUM_ROWS; i++){
                                if(_aNumRowFree[i] === 0){
                                    _iRowColDeleted++;
                                    _aNumRowFree[i] = 10;
                                    this.deleteRow(i, c+aFormLogic[k].x);
                                }
                            }
                            _aNumColFree[c+aFormLogic[k].x] = 10;
                            this.deleteCol(r+aFormLogic[k].y, c+aFormLogic[k].x);
                        }
                        bPlaced = true;
                        _oInterface.viewScore(_iScore);
                    }
                }
                updateScore(_iScore);
            }else{
                createjs.Tween.get(container ).to({x: startpos.x, y: startpos.y, scaleX: 0.7, scaleY: 0.7  }, (200), createjs.Ease.cubicOut).call(function() {});
            }

            if(bPlaced === true){
                _aForm[iFormContainer].deleteForm();
                _aForm[iFormContainer] = 0;
                _iFormsOn--;
            }

            if( bControlGameOver === true && this.isGameOver() ){
                _bThereIsGameOver = true;
            }
        }else{
            createjs.Tween.get(container ).to({x: startpos.x, y: startpos.y, scaleX: 0.7, scaleY: 0.7  }, (200), createjs.Ease.cubicOut).call(function() {});
        }
        _aDrag[iFormContainer] = false;
    };

    this.checkPieceIfFitInPos = function( aPieces, r, c ){
        var bFit = true;
        for ( var k = 0; k < aPieces.length; k++ ){
            if( aPieces[k].sprite !== 0 ){
                if( (aPieces[k].y + r) >= NUM_COLS ||
                    (aPieces[k].x + c) >= NUM_ROWS ){
                    bFit = false;
                    break;
                }
                if( _aGrid[aPieces[k].y + r ][aPieces[k].x + c ].getValue() !== 0 ){
                    bFit = false;
                    break;
                }
            }
        }
       return bFit;
    };

    this.checkPieceIfFitInMatrix = function( oForm ){
        var aPieces = oForm.getFormArray();
        var bFit = false;
        for( var r = 0; r < NUM_ROWS; r++ ){
            for( var c = 0; c < NUM_COLS; c++ ){
               if(this.checkPieceIfFitInPos(aPieces, r, c)){
                    return true;
               }
            }
        }
        return bFit;
    };

    this.isGameOver = function(){
        var bGameOver = true;
            _iCheckGameOverAfterRowColDeleted = 0;

        if( !_aForm ||  (_aForm[0] === 0 && _aForm[1] === 0 && _aForm[2] === 0) ){
           return false;
        }

        for( var i = 0; i < _aForm.length; i++ ){
            if( _aForm[i] !== 0 && this.checkPieceIfFitInMatrix(_aForm[i])){
                bGameOver = false;
                break;
            }
        }
        return bGameOver;
    };

    this.deleteRow = function (r, c){
        for(var i=0; i < NUM_ROWS; i++ ){
            if(c-1-i >= 0){
                _aGrid[r][c-1-i].changeScaleandState();
                _iCellToDelete++;
            }
            if(c+i < NUM_ROWS){
                _aGrid[r][c+i].changeScaleandState();
                _iCellToDelete++;
            }
            _aNumColFree[i]++;
        }
        if(_iRowColDeleted > 1){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("combo");
            }
        }else{
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("combo_plus");
            }
        }
    };

    this.deleteCol = function (r, c){
        for(var i=0; i < NUM_ROWS; i++ ){
            if(r-1-i >= 0){
                _aGrid[r-1-i][c].changeScaleandState(0);
                _iCellToDelete++;
            }
            if(r+i < NUM_ROWS){
                _aGrid[r+i][c].changeScaleandState(0);
                _iCellToDelete++;
            }
            _aNumRowFree[i]++;
        }
        if(_iRowColDeleted > 1){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("combo");
            }
        }else{
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                createjs.Sound.play("combo_plus");
            }
        }
    };

    this.decreaseCellToDeleteCounter = function(){
        _iCellToDelete--;
        if(_iCellToDelete === 0){
            if( this.isGameOver() ){
                this.gameOverText();
            }
        }
    };

    this._setScore = function (iValue){
        _iScore += (SCORE_ROW_COL_DELETED*_iRowColDeleted)*_iRowColDeleted;
        _oInterface.viewScore(_iScore);
        _iRowColDeleted = 0;
    };

    this.unload = function(){
        _oInterface.unload();

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();

        $(s_oMain).trigger("end_level",1);
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session", _iScore);
    };

    this.gameOverText = function(){
        var oTextGameOverOutline = new createjs.Text("GAME OVER"," 60px "+FONT, "#7fc6d8");
        oTextGameOverOutline.x = CANVAS_WIDTH/2;
        oTextGameOverOutline.y = 0;
        oTextGameOverOutline.textAlign = "center";
        oTextGameOverOutline.textBaseline = "alphabetic";
        oTextGameOverOutline.outline = 3;
        oTextGameOverOutline.lineWidth = 500;

        s_oStage.addChild(oTextGameOverOutline);

        var oTextGameOver = new createjs.Text("GAME OVER"," 60px "+FONT, "#ffffff");
        oTextGameOver.x = CANVAS_WIDTH/2;
        oTextGameOver.y = 0;
        oTextGameOver.textAlign = "center";
        oTextGameOver.textBaseline = "alphabetic";
        oTextGameOver.lineWidth = 500;
        s_oStage.addChild(oTextGameOver);

        var oSoundGameOver;
        createjs.Tween.get(oTextGameOverOutline).to({y: CANVAS_HEIGHT/2, alpha:1 }, (2000), createjs.Ease.bounceOut).call(function() {});
        createjs.Tween.get(oTextGameOver).to({y: CANVAS_HEIGHT/2, alpha:1 }, (2000), createjs.Ease.bounceOut).call(function() {s_oGame.gameOver()});
        if(_bGameOverPlayed === false){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                s_oSoundtrack.volume = 0.0;
                oSoundGameOver = createjs.Sound.play("game_over");
                oSoundGameOver.volume = 0.4;
            }
        }
        attemptEnded(_iScore)
    };

    this.gameOver = function(){
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore);
    };

    this.increaseConunterForCheckGameOver = function(){
        _iCheckGameOverAfterRowColDeleted++;
        if( _iCheckGameOverAfterRowColDeleted >= (10*(_iRowColDeleted+1))){
            if( this.isGameOver() ){
                this.gameOverText();
            }
        }
    };

    this.update = function(){
        if(_bUpdate){
            if(_iFormsOn === 0){
                _aForm = [];
                this._createForm();
                if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                    createjs.Sound.play("swish");
                }
            }
            if(s_bUpdate){

                if( this.isGameOver() ){
                    _bThereIsGameOver = true;
                }

                s_bUpdate = false;
            }
            if(_bThereIsGameOver === true){
                this.gameOverText();
                _bThereIsGameOver = false;
            }
            _aScrollingBg[0].move();
            _aScrollingBg[1].move();
        }
    };

    s_oGame=this;

    SCORE_OBJECT_PLACED = oData.score_object_placed;
    SCORE_ROW_COL_DELETED = oData.score_row_col_deleted;
    this._init();

}

var s_oGame;
