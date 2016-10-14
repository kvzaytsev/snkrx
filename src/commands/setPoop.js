import rxStore from '../state';
import _ from '../util';

const setPoop = (s, u) => Object.assign({}, s, {poop: u});
const setPoopEvent = rxStore.eventCreatorFactory(setPoop);
const setPoopCommand = rxStore.commandCreatorFactory((snake) => setPoopEvent(snake.slice(-2,-1)[0]));

export default setPoopCommand;