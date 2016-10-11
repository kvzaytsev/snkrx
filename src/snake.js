import Rx from 'rxjs';

import rxStore from './state';
import * as reducers from './reducers';
import _ from './util';
import {getDirection, isDirectionKey, KEYS} from './keyboard';
import CanvasGraphics from './graphics';
import GLOBALS from './globals';

const graphics = new CanvasGraphics();
graphics.drawGrid();

const speedSubject = new Rx.BehaviorSubject(GLOBALS.INITIAL_SPEED);
const keydownObservable = Rx.Observable.fromEvent(document, 'keydown');
const keys$ = keydownObservable.map (e => e.which);

const pause$ = keys$
        .filter(code => code === KEYS.SPACE)
        .scan((prev) => !prev, false);

const direction$ = keys$
        .filter(isDirectionKey)
        .map(code => ({direction: getDirection(code)}));

const moving$ =  Rx.Observable.merge(speedSubject, direction$);
const refresh$ = 
        speedSubject
            .combineLatest(moving$, speed => speed)
            .switchMap(speed => Rx.Observable.timer(0, speed))
            .withLatestFrom(pause$, (smth, paused) => paused)
            .filter(p => p);

rxStore
    .plug(
        direction$, reducers.direction,
        refresh$, reducers.refresh
    )
    .subscribe(state => graphics.redraw(state));

const setApple = (s, u) => Object.assign({}, s, {apple: u});
const setAppleEvent = rxStore.eventCreatorFactory(setApple);
const setAppleCommand = rxStore.commandCreatorFactory(snake => setAppleEvent(_.generateApple(snake)));

const cutTail = (s, u) => Object.assign({}, s, {snake: u});
const cutTailEvent = rxStore.eventCreatorFactory(cutTail);
const cutTailCommand = rxStore.commandCreatorFactory((snake, apple) => {
    snake.push(apple);
    cutTailEvent(snake);
});

const store$ = rxStore.toRx(Rx);
const snakeLength$ = store$
        .map(({snake}) => snake.length)
        .distinct();

store$
    .distinctKey('snake')
    .subscribe((state) => {
        let snake = state.snake.slice(0),
            head = snake[0].slice(0),
            anApple = state.apple.slice(0);

        if (_.cellsEqual(head, anApple)) {
            setAppleCommand(snake);
            cutTailCommand(snake, anApple);
        }
    });   

snakeLength$
    .filter(len => len % 5 === 0)
    .subscribe(len => {
       speedSubject.next(GLOBALS.INITIAL_SPEED - len * GLOBALS.SPEED_STEP);
    });