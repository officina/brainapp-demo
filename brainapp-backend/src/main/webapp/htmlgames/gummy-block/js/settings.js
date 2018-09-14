var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 960;

var FONT = "bubblegumregular";

var EDGEBOARD_X = 20;
var EDGEBOARD_Y = 100;

var FPS_TIME      = 1000/24;
var DISABLE_SOUND_MOBILE = false;
var SCORE_OBJECT_PLACED;
var SCORE_ROW_COL_DELETED;

var SCROLLING_BG_WIDTH = 640;
var SCROLLING_BG_HEIGHT = 741;
    
var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var NUM_ROWS = 10;
var NUM_COLS = 10;

var CELL_WIDTH   = 48;
var CELL_HEIGHT  = 53;
var PARTICLE_HEIGHT = 115;
var PARTICLE_WIDTH = 140;
var OFFSET_X     = 0;
var OFFSET_Y     = -4;
var START_X_GRID = (CANVAS_WIDTH/2)-(((CELL_WIDTH+OFFSET_X)*11)/2);
var START_Y_GRID = 150;

var MAX_FORMS    = 12;   //I'll go to do a random from 0 (included) to 12 (included)

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;