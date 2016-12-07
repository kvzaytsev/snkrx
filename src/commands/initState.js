import {lens}  from 'rstore';
import rxStore from '../state';
import _ from '../util';

const appleL = lens('apple');
const snakeL = lens('snake');
const directionL = lens('direction');

const setAppleEvent = rxStore.eventCreatorFactory(appleL.set);
const setSnakeEvent = rxStore.eventCreatorFactory(snakeL.set);
const setDirectionEvent = rxStore.eventCreatorFactory(directionL.set);

const initStateCommand = rxStore.commandCreatorFactory(() => {
    const
        initialDirection = _.randomDirection(),
        initialSnake = _.initSnake(initialDirection),
        initialApple = _.generateApple(initialSnake);

    setDirectionEvent(initialDirection);
    setSnakeEvent(initialSnake);
    setAppleEvent(initialApple);

});

export default initStateCommand;
