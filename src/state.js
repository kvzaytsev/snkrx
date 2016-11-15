import {store, storeR, devtools} from 'rstore';
import Rx from 'rxjs';

import _ from './util';

const initStore = () => {
    let initialDirection = _.randomDirection(),
        initialSnake = _.initSnake(initialDirection),
        initialApple = _.generateApple(initialSnake),
        initialState = {
            direction: initialDirection,
            snake: initialSnake,
            apple: initialApple,
            poops: []
        };

    return storeR(initialState);
}

const rxStore = initStore();

export default rxStore;