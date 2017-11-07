function CForms(i, iForm){
    
    var _aForms =[{x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}, {x: 0, y: 0, sprite: 0}];
    var _aGraphicForm = new Array();
    
    var _iValue;
               
    var _oParent = this;
    var _oContainerForm;
    
    var _oPosToStay = {x: 0, y: 0};
    
    this._init = function(i, iForm){
        var iForm;
        
        var _oSourceImage = s_oSpriteLibrary.getSprite("cubes_sprite");
        var oData = {   
                        images: [_oSourceImage], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: 0, regY: 0}, 
                        animations: {background:[0], form0:[1], form1:[2], form2:[3], form3:[4], form4:[5], form5:[6], form6:[7], form7:[8], form8:[9]}
                    };
        switch(i){
            case 0:
                _oPosToStay.x = 50-(CELL_WIDTH/2);
                break;
            case 1:
                _oPosToStay.x = 265-(CELL_WIDTH/2);
                break;
            case 2:
                _oPosToStay.x = 475-(CELL_WIDTH/2);
                break;
        }
        
        _oContainerForm = new createjs.Container();
        
        switch(iForm){
            case 0: //horizontal_5
                _oPosToStay.y = CANVAS_HEIGHT-180;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;
                
                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*7)+(OFFSET_X*7), (CELL_HEIGHT*3)+(OFFSET_Y*3));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <5; i++){
                    _aForms[i].x = i; 
                    _aForms[i].sprite = 4; 
                    
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 4, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                    _aGraphicForm[i].gotoAndStop(4);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
                
            case 1: //vertical_5
                _oPosToStay.x += 60;
                _oPosToStay.y = CANVAS_HEIGHT-280;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;
                
                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*3)+(OFFSET_X*3), (CELL_HEIGHT*7)+(OFFSET_Y*7));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <5; i++){
                    _aForms[i].y = i; 
                    _aForms[i].sprite = 4; 
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 4, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].y = ((CELL_HEIGHT*i)+(OFFSET_Y*i));
                    _aGraphicForm[i].gotoAndStop(4);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
                
            case 2://horizontal_4
                _oPosToStay.x += 15;
                _oPosToStay.y = CANVAS_HEIGHT-180;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;
                
                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*6)+(OFFSET_X*6), (CELL_HEIGHT*3)+(OFFSET_Y*3));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <4; i++){
                    _aForms[i].x = i; 
                    _aForms[i].sprite = 3; 
                    
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 3, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                    _aGraphicForm[i].gotoAndStop(3);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
                
            case 3://vertical_4
                _oPosToStay.x += 60;
                _oPosToStay.y = CANVAS_HEIGHT-250;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*3)+(OFFSET_X*3), (CELL_HEIGHT*6)+(OFFSET_Y*6));
                _oContainerForm.addChild(oHitArea);
                
                for(var i=0; i <4; i++){
                    _aForms[i].y = i; 
                    _aForms[i].sprite = 3; 
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 3, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].y = ((CELL_HEIGHT*i)+(OFFSET_Y*i));
                    _aGraphicForm[i].gotoAndStop(3);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
                
            case 4://horizontal_3
                _oPosToStay.x += 25;
                _oPosToStay.y = CANVAS_HEIGHT-180;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*5)+(OFFSET_X*5), (CELL_HEIGHT*3)+(OFFSET_Y*3));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <3; i++){
                    _aForms[i].x = i; 
                    _aForms[i].sprite = 2; 
                    
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 2, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                    _aGraphicForm[i].gotoAndStop(2);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
                
            case 5://vertical_3
                _oPosToStay.x += 60;
                _oPosToStay.y = CANVAS_HEIGHT-230;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*3)+(OFFSET_X*3), (CELL_HEIGHT*5)+(OFFSET_Y*5));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <3; i++){
                    _aForms[i].y = i; 
                    _aForms[i].sprite = 2; 
                    
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 2, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].y = ((CELL_HEIGHT*i)+(OFFSET_Y*i));
                    _aGraphicForm[i].gotoAndStop(2);
                    _oContainerForm.addChild(_aGraphicForm[i]);

                }
                break;
                
            case 6://horizontal_2
                _oPosToStay.x += 40;
                _oPosToStay.y = CANVAS_HEIGHT-180;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;
                
                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*4)+(OFFSET_X*4), (CELL_HEIGHT*3)+(OFFSET_Y*3));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <2; i++){
                    _aForms[i].x = i; 
                    _aForms[i].sprite = 1; 
                    
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 1, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                    _aGraphicForm[i].gotoAndStop(1);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
                
            case 7://vertical_2
                _oPosToStay.x += 60;
                _oPosToStay.y = CANVAS_HEIGHT-205;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*3)+(OFFSET_X*3), (CELL_HEIGHT*4)+(OFFSET_Y*4));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <2; i++){
                    _aForms[i].y = i; 
                    _aForms[i].sprite = 1; 
                    
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 1, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].y = ((CELL_HEIGHT*i)+(OFFSET_Y*i));
                    _aGraphicForm[i].gotoAndStop(1);
                    _oContainerForm.addChild(_aGraphicForm[i]);

                }
                break;
                
            case 8://square
                _oPosToStay.x += 50;
                _oPosToStay.y = CANVAS_HEIGHT-205;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*4)+(OFFSET_X*4), (CELL_HEIGHT*4)+(OFFSET_Y*4));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <2; i++){
                    for( var j = 0; j < 2; j++){
                    _aForms[(2*i)+j].x = i; 
                    _aForms[(2*i)+j].y = j; 
                    _aForms[(2*i)+j].sprite = 7; 
                        var oSpriteSheet = new createjs.SpriteSheet(oData);
                        _aGraphicForm.push(createSprite(oSpriteSheet, 7, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                        _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                        _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                        _aGraphicForm[(2*i)+j].gotoAndStop(7);
                        _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                    }
                }
                break;
                
            case 9://"vertical_horizontal_3",
                _oPosToStay.x += 30;
                _oPosToStay.y = CANVAS_HEIGHT-230;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*5)+(OFFSET_X*5), (CELL_HEIGHT*5)+(OFFSET_Y*5));
                _oContainerForm.addChild(oHitArea);
                
                _iValue = Math.floor(Math.random() * (4));
                switch (_iValue){
                    case 0:
                        for( var i=0; i <3; i++){
                            for( var j = 0; j < 3; j++){
                                if((i === 0 && (j === 1 || j === 2)) || (i === 1 && (j === 1 || j === 2))){
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }else{
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 6;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 6, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].gotoAndStop(6);
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }
                            }
                        }
                        break;
                    case 1:
                        for( var i=0; i <3; i++){
                            for( var j = 0; j < 3; j++){
                                if((i === 1 && (j === 1 || j === 2)) || (i === 2 && (j === 1 || j === 2))){
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }else{
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 6;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 6, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].gotoAndStop(6);
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }
                            }
                        }
                        break;
                    case 2:
                        for( var i=0; i <3; i++){
                            for( var j = 0; j < 3; j++){
                                if((i === 1 && (j === 0 || j === 1)) || (i === 2 && (j === 0 || j === 1))){
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }else{
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 6;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 6, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].gotoAndStop(6);
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }
                            }
                        }
                        break;
                    case 3:
                        for( var i=0; i <3; i++){
                            for( j = 0; j < 3; j++){
                                if((i === 0 && (j === 0 || j === 1)) || (i === 1 && (j === 0 || j === 1))){
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }else{
                                    _aForms[(3*i)+j].x = i; 
                                    _aForms[(3*i)+j].y = j; 
                                    _aForms[(3*i)+j].sprite = 6;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 6, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(3*i)+j].gotoAndStop(6);
                                    _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);
                                }
                            }
                        }
                        break;
                }
                break;
            case 10: //vertical_horizontal_2
                _oPosToStay.x += 45;
                _oPosToStay.y = CANVAS_HEIGHT-205;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*4)+(OFFSET_X*4), (CELL_HEIGHT*4)+(OFFSET_Y*4));
                _oContainerForm.addChild(oHitArea);
                
                _iValue = Math.floor(Math.random() * (4));
                switch (_iValue){
                    case 0:
                        for( var i=0; i <2; i++){
                            for( var j = 0; j < 2; j++){
                                if(i === 0 && j === 1){
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }else{
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 8;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 8, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].gotoAndStop(8);
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }
                            }
                        }
                        break;
                    case 1:
                        for( var i=0; i <2; i++){
                            for( var j = 0; j < 2; j++){
                                if(i === 1 && j === 1 ){
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }else{
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 8;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 8, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].gotoAndStop(8);
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }
                            }
                        }
                        break;
                    case 2:
                        for( var i=0; i <2; i++){
                            for( var j = 0; j < 2; j++){
                                if(i === 1 && j === 0){
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }else{
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 8;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 8, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].gotoAndStop(8);
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }
                            }
                        }
                        break;
                    case 3:
                        for( var i=0; i <2; i++){
                            for( j = 0; j < 2; j++){
                                if(i === 0 && j === 0){
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 0;
                                    _aGraphicForm.push(new createjs.Shape());
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, (CELL_WIDTH*2)+(OFFSET_X*2), (CELL_HEIGHT*2)+(OFFSET_Y*2));
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }else{
                                    _aForms[(2*i)+j].x = i; 
                                    _aForms[(2*i)+j].y = j; 
                                    _aForms[(2*i)+j].sprite = 8;
                                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                                    _aGraphicForm.push(createSprite(oSpriteSheet, 8, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                                    _aGraphicForm[(2*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                                    _aGraphicForm[(2*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                                    _aGraphicForm[(2*i)+j].gotoAndStop(8);
                                    _oContainerForm.addChild(_aGraphicForm[(2*i)+j]);
                                }
                            }
                        }
                        break;
                }
                break;
            case 11: //point
                _oPosToStay.x += 55;
                _oPosToStay.y = CANVAS_HEIGHT-180;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;
                
                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*3)+(OFFSET_X*3), (CELL_HEIGHT*3)+(OFFSET_Y*3));
                _oContainerForm.addChild(oHitArea);
                
                for(var i=0; i <1; i++){
                    _aForms[i].x = i; 
                    _aForms[i].y = i; 
                    _aForms[i].sprite = 5;
                    var oSpriteSheet = new createjs.SpriteSheet(oData);
                    _aGraphicForm.push(createSprite(oSpriteSheet, 5, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                    _aGraphicForm[i].y = ((CELL_HEIGHT*i)+(OFFSET_Y*i));
                    _aGraphicForm[i].gotoAndStop(5);
                    _oContainerForm.addChild(_aGraphicForm[i]);
                }
                break;
            case 12: //3x3
                _oPosToStay.x += 30;
                _oPosToStay.y = CANVAS_HEIGHT-230;
                
                _oContainerForm.x = _oPosToStay.x;
                _oContainerForm.y = _oPosToStay.y;

                var oHitArea = new createjs.Shape();
                oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0-CELL_WIDTH, 0-CELL_HEIGHT, (CELL_WIDTH*5)+(OFFSET_X*5), (CELL_HEIGHT*5)+(OFFSET_Y*5));
                _oContainerForm.addChild(oHitArea);
                
                for( var i=0; i <3; i++){
                    for( var j = 0; j < 3; j++){
                        _aForms[(3*i)+j].x = i; 
                        _aForms[(3*i)+j].y = j; 
                        _aForms[(3*i)+j].sprite = 9;
                        var oSpriteSheet = new createjs.SpriteSheet(oData);
                        _aGraphicForm.push(createSprite(oSpriteSheet, 9, 0, 0, CELL_WIDTH, CELL_HEIGHT));
                        _aGraphicForm[(3*i)+j].x = ((CELL_WIDTH*i)+(OFFSET_X*i));
                        _aGraphicForm[(3*i)+j].y = ((CELL_HEIGHT*j)+(OFFSET_Y*j));
                        _aGraphicForm[(3*i)+j].gotoAndStop(9);
                        _oContainerForm.addChild(_aGraphicForm[(3*i)+j]);

                    }
                }
                break;
            
        }
        s_oStage.addChild(_oContainerForm);
        createjs.Touch.enable(_oContainerForm);
        _oContainerForm.on("mousedown", this._onFormContainerClick, this);
        _oContainerForm.on("pressup", this._releaseForm, this );
        _oContainerForm.on("pressmove", this._dragForm, this );
        
        _oContainerForm.scaleX = 0.7;
        _oContainerForm.scaleY = 0.7;
    };
    
    this._onFormContainerClick = function(event){
        s_oGame.onFormContainerClick(event, _oContainerForm, i);
    };
    
    this._dragForm = function(event){

         s_oGame.dragForm(event, _oContainerForm, i);  
    };
    
    this._releaseForm = function(event){
        s_oGame.releaseForm(event, _oContainerForm, _oPosToStay, i); 
    }; 
    this.slideContainer = function(){
        var iOld = {x: _oPosToStay.x, y: _oPosToStay.y}
        _oContainerForm.x = 1200;
        createjs.Tween.get(_oContainerForm ).to({ x: iOld.x }, (600), createjs.Ease.cubicOut).call(function() {s_bUpdate = true});
    };
    
    this.setPos = function(iX, iY){
        _oContainerForm.x = iX;
        _oContainerForm.y = iY;
    };
    
    this.getPosX = function(){
        return _oContainerForm.x;
    };
    
    this.getPosY = function(){
        return _oContainerForm.y;
    };
    
    this.getFormArray = function(){
        return _aForms;
    };
    
    this.getForm = function(){
        return iForm;
    };
    
    this.getType = function(){
        return _iValue;
    };
    
    this.deleteForm = function(){
        _oContainerForm.off("mousedown", this._onFormContainerClick, this);
        _oContainerForm.off("pressmove", this._dragForm, this );
        _oContainerForm.off("pressup", this._releaseForm, this );
        s_oStage.removeChild(_oContainerForm);
    };
    
    this._init(i, iForm);
    
}