import {FIELD_SIZE, INITIAL_LENGTH} from './globals';

export const randomInt = (min=4, max=FIELD_SIZE-5) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomCell = (min, max) => [randomInt(min, max), randomInt(min, max)];

export const cellsEqual = (c1, c2) => (c1[0] === c2[0] && c1[1] === c2[1]);

export const cellsCompensative = ([x1,y1], [x2,y2]) => (( x1 + x2) === 0 && (y1 + y2) === 0);

export const checkOutOfBounds = ([[x,y]]) => (x < 0 || y < 0 || x > FIELD_SIZE-1 || y > FIELD_SIZE-1);

export const randomDirection = () => {
    let direction = randomCell(0, 1);
    if (cellsEqual(direction,[0,0]) || cellsEqual(direction,[1,1])) {
        return randomDirection();
    }
    return direction;
};

export const initSnake = (initDirection) => {
    let head = randomCell(),
        body = [];

    for (let i = 1; i < INITIAL_LENGTH; i++ ) {
        body.push([
            head[0]-initDirection[0]*i,
            head[1]-initDirection[1]*i
        ]);
    }

    return [head].concat(body);
};

export const generateApple = (snake) => {
    let cell = randomCell();

    if (snake.filter((segment) => cellsEqual(cell,segment)).length > 0) {
        return generateApple(snake);
    }
    return cell;
};

export const checkSelfEating = (snake) => {
    let copy = snake.slice(0),
        [head] = copy.splice(0,1);

    return !!copy.find( segment => cellsEqual(head,segment));
};
