import Rx from 'rxjs';
import {lens}  from 'rstore';

import rxStore from './state';
import * as reducers from './reducers';
import * as commands from './commands';
import _ from './util';
import {getDirection, isDirectionKey, KEYS} from './keyboard';
import CanvasGraphics from './graphics';
import GLOBALS from './globals';

const lengthSpan = document.querySelector('span.length');
const levelSpan = document.querySelector('span.level');
const restartBtn = document.querySelector('.btn-restart');
const messageText = document.querySelector('text.game-massage');
const playingField = document.querySelector('#playing-layer');

const graphics = new CanvasGraphics();
const dieSubject = new Rx.Subject();
const speedSubject = new Rx.BehaviorSubject(GLOBALS.INITIAL_SPEED);
const keyDownObservable = Rx.Observable.fromEvent(document, 'keydown');
const restartObservable = Rx.Observable.fromEvent(document.querySelector('.btn-restart'), 'click');
const keys$ = keyDownObservable.map (e => e.which);
const store$ = rxStore.toRx(Rx);

const space$ = keys$
        .filter(code => code === KEYS.SPACE);

const restart$ = space$
    .withLatestFrom(dieSubject, (evt, deadEvent) => deadEvent)
    .filter(dEvt => dEvt.TYPE === 'GAME_OVER');

const pause$ = space$
        .scan(prev => !prev, false);

const direction$ = keys$
        .filter(isDirectionKey)
        .map(code => getDirection(code))
        .withLatestFrom(store$, (code, {direction}) => ({code, direction}))
        .filter(({code, direction}) => !_.cellsCompensative(code, direction))
        .map(({code, direction}) => code)
        .withLatestFrom(pause$, (code, paused) => ({code,paused}))
        .filter(({code,paused}) => paused)
        .map(({code,paused}) => code);

const directionL = lens('direction');

restartBtn.setAttribute('disabled', 'disabled');
commands.initState();
graphics.drawGrid();
rxStore.plug(direction$, directionL.set);
rxStore.subscribe(state => {
    _.checkOutOfBounds(state.snake)
        ? dieSubject.next({
            TYPE: 'GAME_OVER',
            message: "Out Of Bounds"
        })
        : graphics.redraw(state)
});

const moving$ = Rx.Observable.merge(speedSubject, direction$);

const createRefreshStresm = () => {
    return Promise.resolve(
        speedSubject
            .combineLatest(moving$, speed => speed)
            .switchMap(speed => Rx.Observable.timer(0, speed))
            .withLatestFrom(pause$, (smth, paused) => paused)
            .filter(p => p)
            .takeUntil(dieSubject)
        );
}

const plugRefreshStream = (rStream) => {
    rxStore.plug(rStream, reducers.refresh);
    return rStream;
};

const createAndPlugRefresh = () => {
    createRefreshStresm()
        .then(plugRefreshStream)
        .then(rStream => store$.sample(rStream, state => state))
        .then(cycle$ => {
            cycle$.subscribe(state => {
                let snake = state.snake.slice(0),
                    head = snake[0].slice(0),
                    anApple = state.apple.slice(0);

                if (_.cellsEqual(head, anApple)) {
                    commands.eatApple(snake, anApple);
                    commands.setApple(snake);
                } else if (_.checkSelfEating(snake)) {
                    dieSubject.next({
                        TYPE: 'GAME_OVER',
                        message: "Self Eating"
                    });
                }
            });
        });
};

const goRestart = () => {
  commands.initState();
  dieSubject.next({
      TYPE: 'RESET',
      message: "Restarting"
  });
  levelSpan.innerHTML = String(1);
  speedSubject.next(GLOBALS.INITIAL_SPEED);
  createAndPlugRefresh();
}

restartObservable.subscribe(() => goRestart());
restart$.subscribe(evt => goRestart());

createAndPlugRefresh();

const snakeLength$ = store$
    .map(({snake}) => snake.length)
    .distinctUntilChanged();

dieSubject.subscribe(cause => {
    switch (cause.TYPE) {
        case 'GAME_OVER':
            restartBtn.removeAttribute('disabled');
            messageText.classList.add('shown');
            playingField.classList.add('gameover');
            break;
        default:
            restartBtn.setAttribute('disabled', 'disabled');
            messageText.classList.remove('shown');
            playingField.classList.remove('gameover');
            break;
    }
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
