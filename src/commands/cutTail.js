import rxStore from '../state';
import _ from '../util';

const cutTail = (s, u) => Object.assign({}, s, {snake: u});
const cutTailEvent = rxStore.eventCreatorFactory(cutTail);
const cutTailCommand = rxStore.commandCreatorFactory(snake => {
    snake.pop();
    cutTailEvent(snake);
});

export default cutTailCommand;