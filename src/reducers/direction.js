const directionReducer = (state, action) => {
    return Object.assign (
        {}, 
        state, 
        {
            direction: action.direction
        }
    );
};

export default directionReducer;