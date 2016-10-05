import {store, storeR} from 'rstore';
import Rx from 'rxjs';

import _ from './util';

const initialDirection = _.randomDirection();
const initialSnake = _.initSnake(initialDirection);
const initialApple = _.generateApple(initialSnake);

const initialState = {
    direction: initialDirection,
    snake: initialSnake,
    apple: initialApple,
    lastKey: 0
};

const rxStore = storeR(initialState);


export default rxStore;