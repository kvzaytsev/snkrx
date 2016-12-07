import {lens}  from 'rstore';
import {eventCreatorFactory, commandCreatorFactory} from 'stk';

const snakeL = lens('snake');
const cutTailEvent = eventCreatorFactory(snakeL.set);
const cutTailCommand = commandCreatorFactory(snake => {
    snake.pop();
    cutTailEvent(snake);
});

export default cutTailCommand;
