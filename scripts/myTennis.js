//Canvas Variables
var canvas;
var canvasContext;

//Ball Variables
var ballX =  400;
var ballY = 300;
var ballSpeedX = 5;
var ballSpeedY = 2;

//Paddle Variables
var paddleLeftY = 250;
var paddleRightY = 250;
const PADDLE_HEIGHT = 120;
const PADDLE_WIDTH = 10;

//Scoring Variables
var playerLeftScore = 0;
var playerRightScore = 0;
const WINNING_SCORE = 9;

//Booleans
var showingTitleScreen = true;
var showingWinScreen = false;

//Function that finds and returns the coordinates of the mouse
function calculateMousePosition(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return{
    x:mouseX,
    y:mouseY
  }
}

//Handles the mouse click
function handleMouseClick(evt){
  showingTitleScreen = false;
  if (showingWinScreen) {
    if (playerLeftScore >= WINNING_SCORE) {
      playerLeftScore = -1;
    } else {
      if (playerRightScore >= WINNING_SCORE) {
        playerRightScore = -1;
      }
    }
    showingWinScreen = false;
  }
}

//Main function
window.onload = function(){
  //Sets the canvas variables
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  //Function that makes the shapes move
  var fps = 60;
  setInterval(function(){
    moveEverything();
    drawEverything();
  }, 1000 / fps);

  canvas.addEventListener('mousedown', handleMouseClick);

  //Moves the left paddle to the mouse position
  canvas.addEventListener('mousemove',
  function(evt){
    var mousePosition = calculateMousePosition(evt);
    paddleLeftY = mousePosition.y - (PADDLE_HEIGHT / 2);
  }
);
}

//Resets ball to center after making a score and turns it backwards
function ballReset(){
  ballSpeedY = 2;
  if (playerLeftScore >= WINNING_SCORE || playerRightScore >= WINNING_SCORE) {
    showingWinScreen = true;
  } else {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  }
}

//AI for right player
function computerMovement(){
  var paddleRightCenter = paddleRightY + (PADDLE_HEIGHT / 2);

  if (ballSpeedX > 0) {
    //Chases the ball if it is heading towards it
    if (paddleRightCenter < ballY - 40) {
      paddleRightY = paddleRightY + 8;
    } else {
      if (paddleRightCenter > ballY + 40) {
        paddleRightY = paddleRightY - 8;
      }
    }
  }

  if (ballSpeedX < 0) {
    //Prevents the AI paddle from spazzing out
    if ((paddleRightCenter > (canvas.height / 2) - 8) && (paddleRightCenter < (canvas.height / 2) + 8)) {
      paddleRightCenter = canvas.height / 2;
    } else {
      //Returns to center after hitting the ball or missing the ball
      if (paddleRightCenter < (canvas.height / 2)) {
        paddleRightY = paddleRightY + 8;
      } else {
        if (paddleRightCenter > (canvas.height / 2)) {
          paddleRightY = paddleRightY - 8;
        }
      }
    }
  }
}

function moveEverything(){
  if (showingWinScreen || showingTitleScreen) {
    return;
  }

  computerMovement();

  //Moves the ball left
  ballX = ballX + ballSpeedX;
  //Moves the ball right
  ballY = ballY + ballSpeedY;

  //Reverses ball direction if it hits floor
  if(ballY >= canvas.height){
    ballSpeedY = -ballSpeedY;
  }

  //Reverses ball direction if it hits roof
  if(ballY <= 0){
    ballSpeedY = -ballSpeedY;
  }

  //Resets the ball to center after right wall got hit, right got scored on
  if(ballX >= canvas.width){
    if(ballY > paddleRightY && ballY < paddleRightY + PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddleRightY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.2;
    } else {
      playerLeftScore++;
      ballReset();
    }
  }

  //Resets the ball to center after left wall got hit, left got scored on
  if(ballX <= 0){
    if(ballY > paddleLeftY && ballY < paddleLeftY + PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddleLeftY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.2;
    } else {
      playerRightScore++;
      ballReset();
    }
  }
}

//Draws a net
function drawNet(){
  for(var i = 0; i < canvas.height; i += 40){
    colorRect(canvas.width / 2 -1, i, 2, 20, 'white');
  }
}

function makeTitleScreen(){
  //Makes the P
  //Vertical lines
  colorRect((canvas.width / 2) - 130, 40, 20, 50, 'white');
  colorRect((canvas.width / 2) - 160, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) - 150, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) - 160, 80, 40, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) - 150, 120, 10, 'white');
  colorCircle((canvas.width / 2) - 120, 90, 10, 'white');
  colorCircle((canvas.width / 2) - 120, 40, 10, 'white');
  colorCircle((canvas.width / 2) - 150, 40, 10, 'white');

  //Makes the O
  //Vertical lines
  colorRect((canvas.width / 2) - 40, 40, 20, 80, 'white');
  colorRect((canvas.width / 2) - 70, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) - 60, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) - 60, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) - 60, 40, 10, 'white');
  colorCircle((canvas.width / 2) - 30, 40, 10, 'white');
  colorCircle((canvas.width / 2) - 60, 120, 10, 'white');
  colorCircle((canvas.width / 2) - 30, 120, 10, 'white');

  //Makes the O
  //Vertical lines
  colorRect((canvas.width / 2) + 50, 40, 20, 80, 'white');
  colorRect((canvas.width / 2) + 20, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + 30, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + 30, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + 30, 40, 10, 'white');
  colorCircle((canvas.width / 2) + 60, 40, 10, 'white');
  colorCircle((canvas.width / 2) + 30, 120, 10, 'white');
  colorCircle((canvas.width / 2) + 60, 120, 10, 'white');

  //Makes the G
  //Vertical lines
  colorRect((canvas.width / 2) + 140, 90, 20, 30, 'white');
  colorRect((canvas.width / 2) + 110, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + 120, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + 145, 80, 5, 20, 'white');
  colorRect((canvas.width / 2) + 120, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + 120, 40, 10, 'white');
  colorCircle((canvas.width / 2) + 150, 40, 10, 'white');
  colorCircle((canvas.width / 2) + 120, 120, 10, 'white');
  colorCircle((canvas.width / 2) + 150, 120, 10, 'white');
  colorCircle((canvas.width / 2) + 150, 90, 10, 'white');
  colorCircle((canvas.width / 2) + 145, 90, 10, 'white');
}

function makeWinScreen(){
  canvasContext.fillStyle = "white";
  if (playerLeftScore >= WINNING_SCORE) {
    //Makes a trophy
    //Handles
    //Left handle
    colorCircle(320, 225, 35, "white");
    colorCircle(320, 225, 15, "black");

    //Right handle
    colorCircle(480, 225, 35, "white");
    colorCircle(480, 225, 15, "black");

    //Rim
    colorRect(320, 180, 160, 80, "white");
    colorCircle(400, 260, 80, "white");

    //Base
    colorRect(370, 300, 60, 80, "white");
    colorRect(340, 380, 120, 30, "white");
    colorCircle(340, 395, 15, "white");
    colorCircle(460, 395, 15, "white");
  } else if (playerRightScore >= WINNING_SCORE){
    //Makes a skull
    //Head
    colorRect(320, 180, 160, 150, "white");
    colorRect(300, 200, 20, 130, "white");
    colorRect(480, 200, 20, 130, "white");
    colorCircle(320, 200, 20, "white");
    colorCircle(480, 200, 20, "white");

    //Jaw
    colorRect(350, 330, 100, 75, "white");

    //Cheeks
    colorCircle(350, 330, 50, "white");
    colorCircle(450, 330, 50, "white");

    //Teeth
    colorCircle(360, 405, 10, "white");
    colorCircle(380, 405, 10, "white");
    colorCircle(400, 405, 10, "white");
    colorCircle(420, 405, 10, "white");
    colorCircle(440, 405, 10, "white");

    //Eyes
    colorCircle(360, 280, 30, "black");
    colorCircle(440, 280, 30, "black");
    colorRect(400, 250, 80, 20, "white");
    colorRect(320, 250, 80, 20, "white");

    //Nose
    colorCircle(400, 330, 10, "black");
    colorCircle(405, 340, 10, "black");
    colorCircle(395, 340, 10, "black");
  }
}

//Draws Everything
function drawEverything(){
  //Sets a black screen as the background
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  //Makes title screen when the game starts
  if (showingTitleScreen == true) {
    makeTitleScreen();
    return;
  }

  //Draws the scoring numbers
  drawLeftNumbers();
  drawRightNumbers();

  //If someone won then game win screen sets up
  //Including shows winner
  //Returns out of draw everything
  if (showingWinScreen) {
    makeWinScreen();
    return;
  }

  drawNet();

  //Draws the left player paddle
  colorRect(0, paddleLeftY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  //Draws the right player paddle
  colorRect(canvas.width - PADDLE_WIDTH, paddleRightY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  //Draws the white ball
  colorCircle(ballX, ballY, 10, 'white');
}

function drawLeftNumbers(){
  if (playerLeftScore == 0) {
    draw0(true);
  } else {

    if (playerLeftScore == 1) {
      draw1(true);
    } else {

      if (playerLeftScore == 2) {
        draw2(true);
      } else {

        if (playerLeftScore == 3) {
          draw3(true);
        } else {

          if (playerLeftScore == 4) {
            draw4(true);
          } else {

            if (playerLeftScore == 5) {
              draw5(true);
            } else {

              if (playerLeftScore == 6) {
                draw6(true);
              } else {

                if (playerLeftScore == 7) {
                  draw7(true);
                } else {

                  if (playerLeftScore == 8) {
                    draw8(true);
                  } else {

                    if (playerLeftScore == 9) {
                      draw9(true);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

function drawRightNumbers(){
  if (playerRightScore == 0) {
    draw0(false);
  } else {

    if (playerRightScore == 1) {
      draw1(false);
    } else {

      if (playerRightScore == 2) {
        draw2(false);
      } else {

        if (playerRightScore == 3) {
          draw3(false);
        } else {

          if (playerRightScore == 4) {
            draw4(false);
          } else {

            if (playerRightScore == 5) {
              draw5(false);
            } else {

              if (playerRightScore == 6) {
                draw6(false);
              } else {

                if (playerRightScore == 7) {
                  draw7(false);
                } else {

                  if (playerRightScore == 8) {
                    draw8(false);
                  } else {

                    if (playerRightScore == 9) {
                      draw9(false);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

//Draws a zero on the left or right side
function draw0(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');
  colorRect((canvas.width / 2) + pos, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 120, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a one on the left or right side
function draw1(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Verticle lines
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a two on the left or right side
function draw2(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos, 80, 20, 40, 'white');
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 40, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 120, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a three on the left or right side
function draw3(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 120, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a four on the left or right side
function draw4(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos, 40, 20, 40, 'white');
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a five on the left or right side
function draw5(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos, 40, 20, 40, 'white');
  colorRect((canvas.width / 2) + pos + 30, 80, 20, 40, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 120, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a six on the left or right side
function draw6(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos, 40, 20, 80, 'white');
  colorRect((canvas.width / 2) + pos + 30, 80, 20, 40, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 120, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a seven on the left or right side
function draw7(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws an eight on the left or right side
function draw8(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');
  colorRect((canvas.width / 2) + pos, 40, 20, 80, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 110, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 120, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Draws a nine on the left or right side
function draw9(side){
  var pos = 0;
  if (side == true) {
    pos = -80;
  } else {
    pos = 30;
  }
  //Vertical lines
  colorRect((canvas.width / 2) + pos + 30, 40, 20, 80, 'white');
  colorRect((canvas.width / 2) + pos, 40, 20, 40, 'white');

  //Horizontal lines
  colorRect((canvas.width / 2) + pos + 10, 30, 30, 20, 'white');
  colorRect((canvas.width / 2) + pos + 10, 70, 30, 20, 'white');

  //Circles
  colorCircle((canvas.width / 2) + pos + 10, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 40, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 10, 80, 10, 'white');
  colorCircle((canvas.width / 2) + pos + 40, 120, 10, 'white');
}

//Function that makes the tennis ball
function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

//Sets the rectangle with the corresponding size and color variables
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
