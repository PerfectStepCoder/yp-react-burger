import { createStore, applyMiddleware, Reducer } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { socketMiddleware } from './middleware/socketMiddleware';
import { RootState, RootAction } from '../utils/types';
import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_GET_MESSAGE,
} from './actions/feedActions';
import {
  WS_USER_ORDERS_CONNECTION_START,
  WS_USER_ORDERS_CONNECTION_SUCCESS,
  WS_USER_ORDERS_CONNECTION_ERROR,
  WS_USER_ORDERS_CONNECTION_CLOSED,
  WS_USER_ORDERS_GET_MESSAGE,
} from './actions/userOrdersActions';

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

// Конфигурация для ленты заказов (публичная)
const feedWsConfig = {
  wsInit: WS_FEED_CONNECTION_START,
  onOpen: WS_FEED_CONNECTION_SUCCESS,
  onError: WS_FEED_CONNECTION_ERROR,
  onClose: WS_FEED_CONNECTION_CLOSED,
  onMessage: WS_FEED_GET_MESSAGE,
};

// Конфигурация для персональных заказов (с авторизацией)
const userOrdersWsConfig = {
  wsInit: WS_USER_ORDERS_CONNECTION_START,
  onOpen: WS_USER_ORDERS_CONNECTION_SUCCESS,
  onError: WS_USER_ORDERS_CONNECTION_ERROR,
  onClose: WS_USER_ORDERS_CONNECTION_CLOSED,
  onMessage: WS_USER_ORDERS_GET_MESSAGE,
};

const store = createStore(
  rootReducer as unknown as Reducer<RootState, RootAction>,
  composeEnhancers(
    applyMiddleware(
      thunk,
      socketMiddleware(feedWsConfig),
      socketMiddleware(userOrdersWsConfig)
    )
  )
);

export default store;
