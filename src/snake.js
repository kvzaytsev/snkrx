import Rx from 'rxjs';

import rxStore from './state';
import * as reducers from './reducers';
import * as commands from './commands';
import _ from './util';
import {getDirection, isDirectionKey, KEYS} from './keyboard';
import CanvasGraphics from './graphics';
import GLOBALS from './globals';

const lengthSpan = document.querySelector('span.length');
const levelSpan = document.querySelector('span.level');

const graphics = new CanvasGraphics();

commands.initState();
graphics.drawGrid();

const dieSubject = new Rx.Subject();
const speedSubject = new Rx.BehaviorSubject(GLOBALS.INITIAL_SPEED);
const keyDownObservable = Rx.Observable.fromEvent(document, 'keydown');
const restartObservable = Rx.Observable.fromEvent(document.querySelector('.btn-restart'), 'click');
const keys$ = keyDownObservable.map (e => e.which);

restartObservable.subscribe(() => {
    levelSpan.innerHTML = String(1);
    commands.initState();
    plugStreams();
    speedSubject.next(GLOBALS.INITIAL_SPEED);
});

const pause$ = keys$
        .filter(code => code === KEYS.SPACE)
        .scan(prev => !prev, false);

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
            // .takeUntil(dieSubject);

rxStore.plug(direction$, reducers.direction);

const plugRefreshStreams = (rStream) => {
    rxStore.plug(rStream, reducers.refresh);
};

plugRefreshStreams(refresh$);
rxStore.subscribe(state => graphics.redraw(state));

const store$ = rxStore.toRx(Rx);
const cycle$ = store$.sample(refresh$, state => state);

cycle$.subscribe(state => {
    let snake = state.snake.slice(0),
        head = snake[0].slice(0),
        anApple = state.apple.slice(0);

    if (_.cellsEqual(head, anApple)) {
        commands.eatApple(snake, anApple);
        commands.setApple(snake);
    } else if (_.checkSelfEating(snake)) {
        dieSubject.next("Self Eating!!!");
    }
});

const snakeLength$ = store$
    .map(({snake}) => snake.length)
    .distinctUntilChanged();

dieSubject.subscribe(message => {
    console.log(message);
});

snakeLength$.subscribe(len => {
    lengthSpan.innerHTML = String(len);
});

snakeLength$
    .filter(len => len % 5 === 0)
    .subscribe(len => {
        speedSubject.next(GLOBALS.INITIAL_SPEED - len * GLOBALS.SPEED_STEP);
        levelSpan.innerHTML = String(Math.floor(len/5)+1);
    });
