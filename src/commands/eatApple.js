import {lens}  from 'rstore';
import rxStore from '../state';

const snakeL = lens('snake');
const eatAppleEvent = rxStore.eventCreatorFactory(snakeL.set);
const eatAppleCommand = rxStore.commandCreatorFactory((snake, apple) => {
    snake.push(apple);
    eatAppleEvent(snake);
});

export default eatAppleCommand;
