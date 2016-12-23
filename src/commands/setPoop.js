import {lens}  from 'rstore';
import {eventCreatorFactory, commandCreatorFactory} from 'stk';

const poopL = lens('poop');
const setPoopEvent = eventCreatorFactory(poopL.set);
const setPoopCommand = commandCreatorFactory((snake) => setPoopEvent(snake.slice(-2,-1)[0]));

export default setPoopCommand;
