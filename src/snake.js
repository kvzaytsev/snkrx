import Rx from 'rxjs';

import rxStore from './state';
import * as reducers from './reducers';
import _ from './util';
import {getDirection, isDirectionKey} from './keyboard';
import CanvasGraphics from './graphics';

const graphics = new CanvasGraphics();
graphics.drawGrid();

// let speed = 500;

const speedSubject = new Rx.BehaviorSubject(500);
const keydownObservable = Rx.Observable.fromEvent(document, 'keydown');

const direction$ = 
    keydownObservable
        .map (e => e.which)
        .filter(isDirectionKey)
        .map(code => ({
            direction: getDirection(code)
        }));

// const refresh$ = direction$.switchMap(d => Rx.Observable.interval(speed).startWith(null));
const refresh$ = 
    speedSubject
        .combineLatest(direction$, speed => speed)
        .switchMap(speed => Rx.Observable.interval(speed).startWith(null));

rxStore
    .plug(
        direction$, reducers.direction,
        refresh$, reducers.refresh
    )
    .subscribe(state => {
        console.timeEnd();
        graphics.redraw(state);
        console.time();
    });

rxStore.toRx(Rx)
    .map(({snake}) => snake.length)
    .filter(len => len % 5 === 0)
    .distinct()
    .subscribe(len => {
        console.log('Current length: ', len);
        speedSubject.next(500 - len * 10);
        // speed = 500 - len * 10;
    });