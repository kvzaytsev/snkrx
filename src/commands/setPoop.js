import {lens}  from 'rstore';
import {eventCreatorFactory, commandCreatorFactory} from 'stk';
import _ from '../util';

const poopL = lens('poop');
const setPoopEvent = eventCreatorFactory(poopL.set);
const setPoopCommand = commandCreatorFactory((snake) => setPoopEvent(snake.slice(-2,-1)[0]));

export default setPoopCommand;
