import { createStore, applyMiddleware, Reducer } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { socketMiddleware } from './middleware/socketMiddleware';
import { RootState, RootAction } from '../utils/types';

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

const store = createStore(
  rootReducer as unknown as Reducer<RootState, RootAction>,
  composeEnhancers(applyMiddleware(thunk, socketMiddleware()))
);

export default store;
