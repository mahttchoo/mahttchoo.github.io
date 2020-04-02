const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
const LAPS_TO_WIN = 3;
var levelOne = [4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,
				 1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,
				 1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,
				 1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,
				 1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,
				 1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,
				 1,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,
				 1,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,
				 1,3,3,1,0,0,1,1,0,0,1,1,1,1,1,1,1,0,0,1,
				 1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,
				 1,2,2,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,
				 1,0,0,1,1,1,1,1,1,1,5,0,0,5,0,0,5,0,0,1,
				 1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,
				 1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,
				 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4];
				 
var trackGrid = [];
var timer = 0;

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYER_START = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;
const BEFORE_GOAL_CHECK = 6;

function returnTileTypeAtColRow(col, row) {
	if(col >= 0 && col < TRACK_COLS &&
		row >= 0 && row < TRACK_ROWS) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return trackGrid[trackIndexUnderCoord];
	} else {
		return TRACK_WALL;
	}
}

function carTrackHandling(whichCar) {
	var carTrackCol = Math.floor(whichCar.x / TRACK_W);
	var carTrackRow = Math.floor(whichCar.y / TRACK_H);
	var trackIndexUndercar = rowColToArrayIndex(carTrackCol, carTrackRow);
	
	timer++;
	
	if(carTrackCol >= 0 && carTrackCol < TRACK_COLS &&
		carTrackRow >= 0 && carTrackRow < TRACK_ROWS) {
		
		var tileHere = returnTileTypeAtColRow(carTrackCol, carTrackRow);
		
		if (tileHere == TRACK_ROAD) {
			whichCar.onGoal = false;
		}
		if (tileHere == BEFORE_GOAL_CHECK) {
			whichCar.beforeGoalTimer = timer;
			console.log("Before: " + whichCar.beforeGoalTimer);
		}
		if (tileHere == TRACK_GOAL) {
			whichCar.goalTimer = timer;
			console.log("Goal: " + whichCar.goalTimer);
			if (!whichCar.onGoal) {
				if (whichCar.goalTimer > whichCar.beforeTimer) {
					whichCar.laps++;
					console.log(whichCar.laps);
				}
			}
			whichCar.onGoal = true;
			if (whichCar.laps == LAPS_TO_WIN) {
				loadLevel(levelOne);
				whichCar.laps = -1;
			}
		} else if (tileHere != TRACK_ROAD && tileHere != BEFORE_GOAL_CHECK) {
			whichCar.x -= Math.cos(whichCar.ang) * whichCar.speed;
			whichCar.y -= Math.sin(whichCar.ang) * whichCar.speed
			whichCar.speed *= -0.9;
		}
	}
}

function rowColToArrayIndex(col, row) {
	return col + TRACK_COLS * row;
}

function drawTracks() {
	var arrayIndex = 0;
	var drawTileX = 0;
	var drawTileY = 0;
	for(var eachRow = 0;eachRow<TRACK_ROWS;eachRow++) {
		for(var eachCol = 0;eachCol<TRACK_COLS;eachCol++) {
			
			//var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
			var tileKindHere = trackGrid[arrayIndex];
			var useImage = trackPics[tileKindHere];
			
			canvasContext.drawImage(useImage, drawTileX, drawTileY);
			drawTileX += TRACK_W;
			arrayIndex++;
		}
		drawTileY += TRACK_H;
		drawTileX = 0;
	}
}