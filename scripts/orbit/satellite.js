//document.addEventListener('DOMContentLoaded', domloaded, false);

function satelliteClass(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.velX = 0;
    this.velY = 0;
    this.accX = 0;
    this.accY = 0;
    this.destroyBool = false;
    this.mass;
    this.velVect = canvas.getContext("2d");
    var p = new prevPathClass(this.x, this.y, this.trailColor);
    this.path = [p];
    this.maxDotDistance = 15;
    this.maxDotCount = 50;

    this.generateColor = function() {
        var i = Math.floor(Math.random() * 6);
        var color;

        switch(i) {
            case 0:
                return 'green';
            case 1:
                return 'blue';
            case 3:
                return 'orange';
            case 4:
                return 'yellow';
            case 5:
                return 'red';
            default:
                return 'pink';
        }
    }

    this.trailColor = this.generateColor();

    this.draw = function () {
        //console.log("X: " + this.accX + "      Y: " + this.accY);
        canvasContext.fillStyle = 'black';
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    this.move = function () {
        this.x = this.x + this.velX;
        this.y = this.y + this.velY;
        this.velX = this.velX + this.accX;
        this.velY = this.velY + this.accY;

        if (this.x > 1500 || this.x < -500 || this.y > 1000 || this.y < -500) {
            this.destroyBool = true;
        }

        this.drawVelocity();
        this.drawAcceleration();

        // the dotted line method doesn't work with very fast satellites
        // the dotted line method doesn't work with a lot of satellites at once, maybe be able to set the trail color?

        var pDistX = this.x - this.path[this.path.length - 1].getX();
        var pDistY = this.y - this.path[this.path.length - 1].getY();
        var d = Math.sqrt((pDistX * pDistX) + (pDistY * pDistY));
        if (d >= this.maxDotDistance) {
            var pathPoint = new prevPathClass(this.x, this.y, this.trailColor);
            this.path.push(pathPoint);
        }
        if (this.path.length > this.maxDotCount) {
            this.path.splice(0,1);
        }

        /*
        var pathPoint = new prevPathClass(this.x, this.y);
        if (this.pCount >= 6) {
            this.path.push(pathPoint);
            this.pCount = 0;
        } else {
            this.pCount++;
        }*/
    }

    this.setVelocity = function (vX, vY) {
        this.velX = vX;
        this.velY = vY;
    }

    this.setAcceleration = function (aX, aY) {
        this.accX = aX;
        this.accY = aY;
    }

    this.doIDestroy = function () {
        return this.destroyBool;
    }

    this.drawVelocity = function () {
        canvasContext.strokeStyle = 'green';
        canvasContext.lineWidth = 2;
        canvasContext.beginPath();
        canvasContext.moveTo(this.x, this.y);
        canvasContext.lineTo((this.x + this.velX * 30), (this.y + this.velY * 30));
        canvasContext.stroke();
    }

    this.drawAcceleration = function () {
        canvasContext.strokeStyle = 'cyan';
        canvasContext.lineWidth = 2;
        canvasContext.beginPath();
        canvasContext.moveTo(this.x, this.y);
        canvasContext.lineTo((this.x + this.accX * 3000), (this.y + this.accY * 3000));
        canvasContext.stroke();
    }

    this.drawPath = function () {
        for (var i = 0; i < this.path.length; i++) {
            this.path[i].draw();
        }
    }

    this.getX = function () {
        return this.x;
    }

    this.getY = function () {
        return this.y;
    }
}