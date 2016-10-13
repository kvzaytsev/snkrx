import {store, storeR, devtools} from 'rstore';
import Rx from 'rxjs';

import _ from './util';

const initialDirection = _.randomDirection();
const initialSnake = _.initSnake(initialDirection);
const initialApple = _.generateApple(initialSnake);

const initialState = {
    direction: initialDirection,
    snake: initialSnake,
    apple: initialApple
};

const rxStore = storeR(initialState);
if (typeof window.devToolsExtension === 'function') {
    devtools.addStore(rxStore, initialState);
}

console.log('store has been created');
export default rxStore;