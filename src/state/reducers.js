import { combineReducers } from 'redux';

import { types } from './actions';


const INITIAL_STATE = {
    user: {
        name: null,
        isLoggedIn: false,
    },
    tweets: {
        list: [],
        alreadyFetched: false,
    },
};

/**
 * redux-promise-middleware suffixes type names with _REJECTED in case a request failed
 * @param {string} action
 * @returns {string}
 */
function rejected(action) {
    return `${action}_REJECTED`;
}

/**
 * redux-promise-middleware suffixes type names with _FULFILLED in case a request failed
 * @param {string} action
 * @returns {string}
 */
function fulfilled(action) {
    return `${action}_FULFILLED`;
}


function fetchTweetsReducer(state = INITIAL_STATE.tweets, action) {
    switch (action.type) {
        case fulfilled(types.GET_TWEETS):
            return {
                list: action.payload,
                alreadyFetched: true,
            };
        case rejected(types.GET_TWEETS):
        default:
            return state;
    }
}

function getUserInfoReducer(state = INITIAL_STATE.user, action) {
    switch (action.type) {
        case fulfilled(types.GET_USER_INFO):
            console.info('Got logged in user info', action.payload);
            return action.payload;
        case rejected(types.GET_USER_INFO):
        default:
            return state;
    }
}

const reducers = combineReducers({
    tweets: fetchTweetsReducer,
    user: getUserInfoReducer,
});

export default reducers;
