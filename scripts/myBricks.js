//Misc variables
var lives = 3;
var level = 0;
var score = 0;
var titleScreen = true;
var scoreScreen = false;

//Ball variables
var ballX = 75;
var ballY = 75;
var ballSpeedX = 2.5;
var ballSpeedY = 3.5;

//Brick variables
const BRICK_WIDTH = 114; //80
const BRICK_HEIGHT = 30; //20
const BRICK_GAP = 2;
const BRICK_COLS = 7; //10
const BRICK_ROWS = 10; //14
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

//Paddle variables
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 10;
const PADDLE_BUFFER = 60;
var paddleX = 400;

//Canvas variables
var canvas, canvasContext;

//Coordinates
var mouseX = 0;
var mouseY = 0;

//Moves the paddle with mouse
function updateMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
	paddleX = mouseX - PADDLE_WIDTH / 2;

	//Cheats
	/*ballX = mouseX;
	ballY = mouseY;
	ballSpeedX = 0;
	ballSpeedY = 0;*/
}

function handleMouseClick(evt){
	titleScreen = false;
	if (scoreScreen) {
		score = 0;
		level = 0;
		brickReset();
		ballReset();
		lives = 3;
		ballSpeedX = 2.5;
		ballSpeedY = 3.5;
	}
	scoreScreen = false;
}

//Sets all bricks in brickGrid to 1 HP
function brickReset(){
	bricksLeft = 0;

	for (var i = 3 * BRICK_COLS; i < BRICK_COLS * BRICK_ROWS; i++) {
		brickGrid[i] = 1;
		bricksLeft++;
	}

	raiseDifficulty();
}

//Goes through and adds HP onto bricks depending on the level.
function raiseDifficulty(){
	for (var j = 0; j < level; j++) {
		for (var i = 3 * BRICK_COLS; i < (BRICK_ROWS * BRICK_COLS); i++) {
			//Forty percent chance to upgrade brick.
			if (Math.random() < 0.4) {
				if (brickGrid[i] < 5) {
					brickGrid[i]++;
					bricksLeft++;
				}
			}
		}
	}
}

//Main function
window.onload = function() {
	//Sets up canvas
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	//FPS
	var fps = 60;
	setInterval(updateAll, 1000 / fps);

	canvas.addEventListener('mousemove', updateMousePos);
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('keydown', powerups, false);

	brickReset();
	ballReset();
}

//Power-ups
function powerups(e){
	var keyCode = e.keyCode;
	if (keyCode == 49) {
		console.log("works");
	}
}

//Calls moveAll and drawAll every 1000 / 30 milliseconds
function updateAll(){
	moveAll();
	drawAll();
}

//Resets the ball to the center
function ballReset(){
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

//Moves the ball
function ballMove(){
	//Speed variables
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	//Collision statements for walls
	//Left wall
	if (ballX < 0 && ballSpeedX < 0.0) {
		ballSpeedX *= -1;
	}

	//Right wall
	if (ballX > canvas.width && ballSpeedX > 0.0) {
		ballSpeedX *= -1;
	}

	//Ceiling
	if (ballY < 0 && ballSpeedY < 0.0) {
		ballSpeedY *= -1;
	}

	//Floor
	if (ballY > canvas.height) {
		ballReset();
		lives--;
		if (lives <= 0) {
			scoreScreen = true;
		}
	}
}

function isBrickAtColRow(col, row){
	if (col >= 0 && col < BRICK_COLS &&
		row >= 0 && row < BRICK_ROWS){
		var brickIndexUnderCoord = rowColToArrayIndex(col, row);
		return brickGrid[brickIndexUnderCoord];
	} else {
		return 0;
	}
}

//Breaks the bricks
function ballBrickHandling(){
	//Breaks bricks when ball hits them
	var ballBrickCol = Math.floor(ballX / BRICK_WIDTH);
	var ballBrickRow = Math.floor(ballY / BRICK_HEIGHT);
	var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

	if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
		ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

			if (brickGrid[brickIndexUnderBall]) {
				brickGrid[brickIndexUnderBall]--;
				bricksLeft--;
				score += 10;

				//Previous ball locations
				var prevBallX = ballX - ballSpeedX;
				var prevBallY = ballY - ballSpeedY;
				var prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH);
				var prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT);

				var bothTestsFailed = true;

				if (prevBrickCol != ballBrickCol) {
					if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false){
						ballSpeedY *= -1;
						bothTestsFailed == false;
					}
				}

				if (prevBrickRow != ballBrickRow) {
					if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
						ballSpeedX *= -1;
						bothTestsFailed == false;
					}
				}

				if (bothTestsFailed) {
					ballSpeedX *= -1;
					ballSpeedY *= -1;
				}

				if (bricksLeft == 0) {
					score += 100;
					level++;
					lives++;
					ballReset();
					brickReset();
			}
		}
	}
}

//Moves the ball after it hits the paddle or a wall
function ballPaddleHandling(){
	//Collision statements for paddle
	var paddleTopEdgeY = canvas.height - PADDLE_BUFFER;
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_HEIGHT;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

	if (ballY > paddleTopEdgeY &&
		ballY < paddleBottomEdgeY &&
		ballX > paddleLeftEdgeX &&
		ballX < paddleRightEdgeX){
			ballSpeedY *= -1;
			var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
			var ballDistanceFromPaddleCenterX = ballX - centerOfPaddleX;
			ballSpeedX = ballDistanceFromPaddleCenterX * 0.175;
	}
}

function moveAll(){
	ballMove();
	ballBrickHandling();
	ballPaddleHandling();
}

function rowColToArrayIndex(col, row){
	return col + BRICK_COLS * row;
}

function drawBricks(){
	for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

			if (brickGrid[arrayIndex] == 1) {
				colorRect(BRICK_WIDTH * eachCol + 2, BRICK_HEIGHT * eachRow,
				BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, "#AED6F1");
			}
			if (brickGrid[arrayIndex] == 2) {
				colorRect(BRICK_WIDTH * eachCol + 2, BRICK_HEIGHT * eachRow,
				BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, "#85C1E9");
			}
			if (brickGrid[arrayIndex] == 3) {
				colorRect(BRICK_WIDTH * eachCol + 2, BRICK_HEIGHT * eachRow,
				BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, "#3498DB");
			}
			if (brickGrid[arrayIndex] == 4) {
				colorRect(BRICK_WIDTH * eachCol + 2, BRICK_HEIGHT * eachRow,
				BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, "##3498DB");
			}
			if (brickGrid[arrayIndex] == 5) {
				colorRect(BRICK_WIDTH * eachCol + 2, BRICK_HEIGHT * eachRow,
				BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, "#1B4F72");
			}
		}
	}
}

function drawAll(){
	//Prints canvas
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if (titleScreen) {
		//Makes the title screen
		drawTitleScreen();
	} else {
		if (scoreScreen) {
			//Makes the screen that displays your score after you lose
			drawScoreScreen();
		} else {
			//Draws various text
			//Draws the lives
			canvasContext.fillStyle = "white";
			canvasContext.fillText(lives, 40, 20);

			//Draws the score
			canvasContext.fillText(score, 140, 20);

			//Draws the ball
			colorCircle(ballX, ballY, 10, 'white');

			//Draws the paddle
			colorRect(paddleX, canvas.height - PADDLE_BUFFER, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

			//Draws the bricks
			drawBricks();

			//Draws various images
			drawLives();
			drawLevel();
		}
	}
}

//Draws a heart next to life counter
function drawLives(){
	colorCircle(10, 10, 5, "red");
	colorCircle(20, 10, 5, "red");
	colorRect(5, 10, 20, 5, "red");

	canvasContext.rotate(45 * Math.PI / 180);
	colorRect(14, -3, 13, 10, "red");
	canvasContext.rotate(-45 * Math.PI / 180);

	canvasContext.rotate(45 * Math.PI / 180);
	colorRect(20, -8, 8, 15, "red");
	canvasContext.rotate(-45 * Math.PI / 180);
}

function drawLevel(){
	colorRect(105, 20, 15, 5, "yellow");
	colorRect(109, 15, 7, 5, "yellow");

	colorCircle(112.5, 10, 7, "yellow");
	colorRect(105, 3, 15, 3, "black");

	colorCircle(106, 10, 3, "yellow");
	colorCircle(119, 10, 3, "yellow");
}

function drawTitleScreen(){
	base_image = new Image();
	base_image.src = '../scripts/images/title.jpg';
	canvasContext.drawImage(base_image, 31, 100, 738, 162);
}

function drawScoreScreen(){
	canvasContext.fillStyle = "white";
	canvasContext.fillText("Click", canvas.width / 2, canvas.height / 2);
	canvasContext.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 - 30);
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colorText(words, textX, textY, fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(words, textX, textY);
}
