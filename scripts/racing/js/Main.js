var canvas, canvasContext;

var blueCar = new carClass();
var greenCar = new carClass();

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	loadImages();
}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000 / framesPerSecond);
	
	setUpInput();
	loadLevel(levelOne);
	blueCar.reset(carPic);
	greenCar.reset(carPic2);
}

function loadLevel(whichLevel){
	trackGrid = whichLevel.slice();
	blueCar.reset(carPic, "Blue Bonnet");
	greenCar.reset(carPic2, "Green Peace");
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
	blueCar.move();
	greenCar.move();
}

function drawAll() {
	drawTracks();
	blueCar.draw();
	greenCar.draw();
}