import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';

/**
 * Creates a redux store, add relevant middleware for the async nature of the application
 */
const store = createStore(reducers, {}, applyMiddleware(
    thunkMiddleware,
    promiseMiddleware()
));

export default store;
