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
        .switchMap(speed => Rx.Observable.timer(0, speed));

rxStore
    .plug(
        direction$, reducers.direction,
        refresh$, reducers.refresh
    )
    .subscribe(state => {
        graphics.redraw(state);
    });

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
const snakeLength$ = 
    store$
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
       speedSubject.next(500 - len * 10);
    });
