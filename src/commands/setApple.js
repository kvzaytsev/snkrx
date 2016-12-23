import {lens}  from 'rstore';
import rxStore from '../state';
import {generateApple} from '../util';

const appleL = lens('apple');
const setAppleEvent = rxStore.eventCreatorFactory(appleL.set);
const setAppleCommand = rxStore.commandCreatorFactory(
    snake => setAppleEvent(generateApple(snake.slice(0)))
);

export default setAppleCommand;
