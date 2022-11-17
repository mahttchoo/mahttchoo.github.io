function prevPathClass(posX, posY, color) {
    this.x = posX;
    this.y = posY;
    this.c = color;

    this.draw = function() {
        canvasContext.fillStyle = this.c;
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, 3, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    this.getX = function() {
        return this.x;
    }

    this.getY = function() {
        return this.y;
    }
}