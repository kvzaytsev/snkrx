const KEYS = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

const getDirection = (keyCode) => {
    switch (keyCode) {
        case KEYS.LEFT:
            return [-1,0];
        case KEYS.UP:
            return [0,-1];
        case KEYS.DOWN:
            return [0,1];
        case KEYS.RIGHT:
            return [1,0];
    }
}

const isDirectionKey = (keyCode) => {
    return [KEYS.LEFT, KEYS.UP, KEYS.DOWN, KEYS.RIGHT].includes(keyCode)
}

export {getDirection, isDirectionKey, KEYS};