import { createStore, applyMiddleware, Reducer } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { RootState, RootAction } from '../utils/types';

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

const store = createStore(
  rootReducer as unknown as Reducer<RootState, RootAction>,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
