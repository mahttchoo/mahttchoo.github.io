const GROUND_SPEED_DECAY_MULT = 0.94;
const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.04;
const MIN_SPEED_TO_TURN = 0.5;

function carClass() {
	this.x = 75;
	this.y = 75;
	this.ang = -Math.PI / 2;
	this.speed = 0;
	this.myCarPic;
	this.laps = -1;
	this.onGoal = false;
	this.beforeGoalTimer = 0;
	this.goalTimer = 0;
	
	this.keyHeld_Gas = false;
	this.keyHeld_Reverse = false;
	this.keyHeld_TurnLeft = false;
	this.keyHeld_TurnRight = false;
	
	this.controlKeyUp;
	this.controlKeyDown;
	this.controlKeyLeft;
	this.controlKeyRight;
	
	this.setupInput = function(upKey, downKey, leftKey, rightKey) {
		this.controlKeyUp = upKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
		this.controlKeyRight = rightKey;
	}
	
	this.reset = function(whichImage, carName) {
		this.name = carName;
		this.myCarPic = whichImage;
		this.ang = -Math.PI / 2;
		this.speed = 0;
		for(var eachRow=0;eachRow<TRACK_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<TRACK_COLS;eachCol++) {
				
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow); 
				
				if(trackGrid[arrayIndex] == TRACK_PLAYER_START) {
					trackGrid[arrayIndex] = BEFORE_GOAL_CHECK;
					this.x = eachCol * TRACK_W + TRACK_W / 2;
					this.y = eachRow * TRACK_H + TRACK_H / 2;
					return;
				}
			}
		}
	}
	
	this.move = function() {
		this.speed *= GROUND_SPEED_DECAY_MULT;
		if (this.keyHeld_Gas) {
			this.speed += DRIVE_POWER;
		}
		
		if (this.keyHeld_Reverse) {
			this.speed -= REVERSE_POWER;
		}
		if (Math.abs(this.speed) > MIN_SPEED_TO_TURN) {
			if (this.keyHeld_TurnLeft) {
				this.ang -= TURN_RATE;
			}
			if (this.keyHeld_TurnRight) {
				this.ang += TURN_RATE;
			}
		}
		
		this.x += this.speed * Math.cos(this.ang);
		this.y += this.speed * Math.sin(this.ang);
		
		carTrackHandling(this);
	}
	
	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myCarPic, this.x, this.y, this.ang);
	}
}