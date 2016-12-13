import {FIELD_SIZE, INITIAL_LENGTH} from './globals';

const Utils = {

    randomInt (min=4, max=FIELD_SIZE-5) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomCell (min, max) {
        return [this.randomInt(min, max), this.randomInt(min, max)];
    },

    randomDirection () {
        let direction = this.randomCell(0, 1);
        if (this.cellsEqual(direction,[0,0]) || this.cellsEqual(direction,[1,1])) {
            return this.randomDirection();
        }
        return direction;
    },

    cellsEqual (c1, c2) {
        return c1[0] === c2[0] && c1[1] === c2[1];
    },

    cellsCompensative ([x1,y1], [x2,y2]) {
      return (( x1 + x2) === 0 && (y1 + y2) === 0);
    },

    // cellsСompensative: function ([x1,y1], [x2,y2]) {
    //   return (( x1 + x2) === 0 && (y1 + y2) === 0);
    // },

    initSnake (initDirection) {
        let
            head = this.randomCell(),
            body = [];

        for (let i = 1; i < INITIAL_LENGTH; i++ ) {
            body.push([
                head[0]-initDirection[0]*i,
                head[1]-initDirection[1]*i
            ]);
        }

        return [head].concat(body);
    },

    generateApple (snake) {
        let cell = this.randomCell();
        if (snake.filter((segment) => this.cellsEqual(cell,segment)).length > 0) {
            return this.generateApple(snake);
        }
        return cell;
    },

    checkSelfEating (snake) {
        let copy = snake.slice(0),
            [head] = copy.splice(0,1);

        return !!copy.find( segment => this.cellsEqual(head,segment));
    },

    checkOutOfBounds ([[x,y]]) {
        return x < 0 || y < 0 || x > FIELD_SIZE-1 || y > FIELD_SIZE-1;
    }
}

export default Utils
