import GLOBALS from '../globals';

const refreshReducer = (state, action) => {
    let newSnake = state.snake.slice(0),
        head = newSnake[0].slice(0);

    console.log('refreshReducer');
    newSnake.unshift(shiftCell(head, state.direction));
    newSnake.pop();

    return Object.assign({}, state, {snake:newSnake});
}

const shiftCell = ([cx, cy], [dx, dy]) => [shift(cx, dx), shift(cy, dy)];
const shift = (c, d) => c + d;

export default refreshReducer;
