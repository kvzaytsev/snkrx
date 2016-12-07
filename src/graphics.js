import Globals from './globals';

class CanvasGraphics {

    redraw ({
        snake,
        apple
    }) {
        this.clear();
        this.drawApple(apple);
        this.drawSnake(snake);
    }

    drawGrid () {
        let size = Globals.FIELD_SIZE * Globals.CELL_SIZE,
            canvas = `<canvas id="sCanvas" class="snake-canvas" width="${size}" height="${size}"></canvas>`;
        
        document.getElementById('playing-layer').innerHTML = canvas;
        this.canvas = document.getElementById("sCanvas");
        this.ctx = this.canvas.getContext("2d");
    }

    drawApple([x,y]) {
        this.drawCell([x,y], "#1AB394", "#243546");
    }

    drawPoop(apple) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.drawCell(apple);
        this.ctx.stroke();
    }

    draw(toDraw) {
        this.clear();
        this.drawApple(toDraw.apple);
        this.drawSnake(toDraw.snake);
    }

    drawSnake(snake) {
        let i,l,segment, dir;

        for(i = 1, l = snake.length; i < l; i++) {
            this.drawSegment(snake[i]);
        }

        this.drawCell(snake[0], "#A3B7C9", "#95ACC3");
    }

    drawSegment(segment) {
        //this.drawCell(segment, "#445C72", "#95ACC3");
        this.drawCell(segment, "#425C73", "#95ACC3");
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCell ([x,y], backgroundColor, borderColor) {
        this.ctx.beginPath();
        this.ctx.fillStyle = backgroundColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.rect(
            x * Globals.CELL_SIZE + 1,
            y * Globals.CELL_SIZE + 1,
            Globals.CELL_SIZE-2,
            Globals.CELL_SIZE-2
        );
        this.ctx.fill();
        this.ctx.stroke();
    }
}

export default CanvasGraphics;