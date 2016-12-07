import {storeR} from 'rstore';

const initStore = () => {
    let initialState = {
            direction: null,
            snake: null,
            apple: null
        };

    return storeR(initialState);
}

const rxStore = initStore();

export default rxStore;