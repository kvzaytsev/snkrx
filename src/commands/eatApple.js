import rxStore from '../state';
import _ from '../util';

const eatApple = (s, u) => Object.assign({}, s, {snake: u});
const eatAppleEvent = rxStore.eventCreatorFactory(eatApple);
const eatAppleCommand = rxStore.commandCreatorFactory((snake, apple) => {
    snake.push(apple);
    eatAppleEvent(snake);
});

export default eatAppleCommand;