import { persistStore } from 'redux-persist';
const { default: rootReducer } = require('../redux/RootReducer');

const {createStore, applyMiddleware} = require('redux');
const middlewares = [];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

const persistor = persistStore(store);

export {store, persistor};