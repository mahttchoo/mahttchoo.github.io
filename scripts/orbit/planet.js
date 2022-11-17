function planetClass(posX, posY, mass) {
    this.x = posX;
    this.y = posY;
    this.mass = mass;

    this.draw = function () {
        canvasContext.fillStyle = 'red';
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, 15, 0, Math.PI*2, true);
        canvasContext.fill();
    }

    this.getX = function() {
        return this.x;
    }

    this.getY = function() {
        return this.y;
    }

    this.getMass = function() {
        return this.mass;
    }
}