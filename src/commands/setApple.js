import {lens}  from 'rstore';
import rxStore from '../state';
import _ from '../util';

const appleL = lens('apple');
const setAppleEvent = rxStore.eventCreatorFactory(appleL.set);
const setAppleCommand = rxStore.commandCreatorFactory(snake => setAppleEvent(_.generateApple(snake)));

export default setAppleCommand;
