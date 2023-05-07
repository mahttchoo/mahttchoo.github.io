//Canvas Variables
var canvas;
var canvasContext;

const satelliteList = [];
const planetList = [];

var placeSat = true;

//Main function
window.onload = function () {
    //Sets the canvas variables
    canvas = document.getElementById('myCanvas');
    myCanvas.width = window.innerWidth - 500;
    myCanvas.height = window.innerHeight - 150;
    canvasContext = canvas.getContext('2d');

    uiCanvas = document.getElementById('uiCanvas');
    uiCanvas.width = 300;
    uiCanvas.height = 300;
    uiCanvasContext = uiCanvas.getContext('2d');

    document.getElementById('ui').style.height = "" + (myCanvas.height + 4) + "px";
    colorRect(0,0,300,300, "white", uiCanvasContext);
    colorCircle(150, 150, 25, 'black', uiCanvasContext);

    var fps = 60;
    setInterval(function () {
        colorRect(0, 0, canvas.width, canvas.height, 'white', canvasContext);
        updateObjects();
    }, 1000 / fps);

    var UIfps = 40;
    setInterval(function () {
        if (placeSat) {
            updateSatUI();
        }
    }, 1000 / UIfps);


    canvas.addEventListener('mousedown', handleMouseClick);
}

function handleMouseClick(evt) {
    switch (placeSat) {
        case false:
            var mousePos = calculateMousePosition(evt);
            var planet = new planetClass(mousePos.x, mousePos.y, 30);
            planetList.push(planet);
            break;
        case true:
            var mousePos = calculateMousePosition(evt);
            var sat = new satelliteClass(mousePos.x, mousePos.y);

            var totalVel = document.getElementById('initVel').value / 5;
            var angle = document.getElementById('initAngle').value * (Math.PI / 180);
            var xVel = totalVel * Math.cos(angle);
            var yVel = totalVel * Math.sin(angle) * -1; // negative since y=0 is the top of the screen
            sat.setVelocity(xVel, yVel);

            satelliteList.push(sat);
            break;
        default:
            var mousePos = calculateMousePosition(evt);
            var sat = new satelliteClass(mousePos.x, mousePos.y);
            sat.setVelocity(document.getElementById("xVel").value, document.getElementById("yVel").value);
            satelliteList.push(sat);
            break;
    }
}

function colorRect(leftX, topY, width, height, drawColor, context) {
    context.fillStyle = drawColor;
    context.fillRect(leftX, topY, width, height);
}

function colorCircle(x, y, r, drawColor, context) {
    context.fillStyle = drawColor;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.fill();
}

function colorText(leftX, topY, text, font, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.font = "bold 36px Arial";
    canvasContext.fillText(text, leftX, topY);
}

function calculateMousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

function updateObjects(){
    for (var i = 0; i < satelliteList.length; i++) {
        var newAccX = 0;
        var newAccY = 0;
        satelliteList[i].draw();
        satelliteList[i].drawPath();
        satelliteList[i].move();
        for (var k = 0; k < planetList.length; k++) {
            var xdist = planetList[k].getX() - satelliteList[i].getX();
            var ydist = planetList[k].getY() - satelliteList[i].getY();
            var distToPlanet = Math.sqrt((xdist * xdist) + (ydist * ydist));
            var gravityForce = 3/(distToPlanet * distToPlanet);
            newAccX += gravityForce * xdist;
            newAccY += gravityForce * ydist;
        }
        satelliteList[i].setAcceleration(newAccX, newAccY);
        if (satelliteList[i].doIDestroy() == true) {
            satelliteList.splice(i, 1);
        }
    }

    for (var i = 0; i < planetList.length; i++) {
        planetList[i].draw();
    }
}

function swapUI() {
    console.log("Initial Velocity: " + document.getElementById('initVel').value);
    console.log("Initial Angle: " + document.getElementById('initAngle').value);
    switch (placeSat) {
        case false:
            placeSat = true;
            // UI Canvas updates for satelittes are done via window onload function
            break;
        case true:
            placeSat = false;
            colorRect(0,0,300,300, "white", uiCanvasContext);
            colorCircle(150, 150, 40, 'red', uiCanvasContext);
            break;
        default:
            break;
    }
}

function updateSatUI() {
    colorRect(0,0,300,300, "white", uiCanvasContext);
    colorCircle(150, 150, 25, 'black', uiCanvasContext);

    uiCanvasContext.strokeStyle = 'green';
    uiCanvasContext.lineWidth = 4;
    uiCanvasContext.beginPath();
    uiCanvasContext.moveTo(150, 150);

    var totalVel = document.getElementById('initVel').value / 7;
    var angle = document.getElementById('initAngle').value * (Math.PI / 180);
    var x = totalVel * Math.cos(angle) * 35; // 10 is an arbitrary number so that the visual velocity vector looks nice in the UI
    var y = totalVel * Math.sin(angle) * 35 * -1;

    uiCanvasContext.lineTo(x + 150, y + 150); // 150 is midpoint of the UI canvas
    uiCanvasContext.stroke();
}

// https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting