import {createStore, applyMiddleware} from "redux";
import ExecutionEnvironment from "exenv";
import {reducePropsToState, handleClientStateChange} from "./HelmetUtils";

import rootReducer from "./modules";

function handleOnClientMiddleware({getState}) {
    return next => action => {
        const prevState = getState();
        const result = next(action);
        const nextState = getState();
        if (prevState !== nextState) {
            const state = reducePropsToState(nextState.values);
            handleClientStateChange(state);
        }
        return result;
    };
}

export default function createHelmetStore(...middlewares) {
    const extra = [
        ...middlewares,
        ...(ExecutionEnvironment.canUseDOM ? [handleOnClientMiddleware] : [])
    ];
    if (extra.length > 0) {
        return createStore(rootReducer, applyMiddleware(...extra));
    }
    return createStore(rootReducer);
}