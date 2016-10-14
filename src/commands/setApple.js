import rxStore from '../state';
import _ from '../util';

const setApple = (s, u) => Object.assign({}, s, {apple: u});
const setAppleEvent = rxStore.eventCreatorFactory(setApple);
const setAppleCommand = rxStore.commandCreatorFactory(snake => setAppleEvent(_.generateApple(snake)));

export default setAppleCommand;