//TODO: maybe make the previous path dots depend on the last distance from the previous points previous point
// This will help deal with the squished corners when it slows down and turns around
// it will also help deal with when it zooms off and the dots get very far
// also prolly make a max count of previous points lol.
// Maybe use lines instead of dots??? This will work if we use the distance between points to decide a new point, not time.

//Canvas Variables
var canvas;
var canvasContext;

const satelliteList = [];
const planetList = [];

var whatAmIPlacing = 0;

//Main function
window.onload = function () {
    //Sets the canvas variables
    canvas = document.getElementById('myCanvas');
    canvasContext = canvas.getContext('2d');
    console.log("hi");

    var fps = 60;
    setInterval(function () {
        colorRect(0, 0, canvas.width, canvas.height, 'white');

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
                updateObjectCounts();
            }
        }

        for (var i = 0; i < planetList.length; i++) {
            planetList[i].draw();
        }
    }, 1000 / fps);


    canvas.addEventListener('mousedown', handleMouseClick);
}

function handleMouseClick(evt) {
    switch (whatAmIPlacing) {
        case 0:
            var mousePos = calculateMousePosition(evt);
            var sat = new satelliteClass(mousePos.x, mousePos.y);
            sat.setVelocity(-1, 2);
            satelliteList.push(sat);
            break;
        case 1:
            var mousePos = calculateMousePosition(evt);
            var planet = new planetClass(mousePos.x, mousePos.y, 30);
            planetList.push(planet);
            break;
        default:
            var mousePos = calculateMousePosition(evt);
            var sat = new satelliteClass(mousePos.x, mousePos.y);
            sat.setVelocity(document.getElementById("xVel").value, document.getElementById("yVel").value);
            satelliteList.push(sat);
            break;
    }
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
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

function incrementWhatAmIPlacing() {
    switch (whatAmIPlacing) {
        case 0:
            whatAmIPlacing++;
            var text = document.getElementById("whatAmIPlacing");
            text.innerHTML = "Planet";
            break;
        case 1:
            whatAmIPlacing--;
            var text = document.getElementById("whatAmIPlacing");
            text.innerHTML = "Satellite";
            break;
        default:
            var text = document.getElementById("whatAmIPlacing");
            text.innerHTML = "uhhh something is wrong :(";
            break;
    }
}