import _ from '../util';

const refreshReducer = (state, action) => {

    let clone = Object.assign ({}, state),
        snake = clone.snake.slice(0),
        direction = clone.direction.slice(0),
        head = snake[0].slice(0),
        apple = clone.apple.slice(0);

    head[0] = Math.abs((30 + head[0] + direction[0]) % 30);
    head[1] = Math.abs((30 + head[1] + direction[1]) % 30); 
    snake.unshift(head);
    snake.pop();

    return {     
        snake,
        direction,
        apple
    };
}

export default refreshReducer;