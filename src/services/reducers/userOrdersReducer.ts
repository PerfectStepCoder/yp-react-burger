import {
  WS_USER_ORDERS_CONNECTION_START,
  WS_USER_ORDERS_CONNECTION_SUCCESS,
  WS_USER_ORDERS_CONNECTION_ERROR,
  WS_USER_ORDERS_CONNECTION_CLOSED,
  WS_USER_ORDERS_GET_MESSAGE,
  UserOrdersAction,
} from '../actions/userOrdersActions';
import { UserOrdersState } from '../../utils/types';

const initialState: UserOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  error: undefined,
};

const userOrdersReducer = (state: UserOrdersState = initialState, action: UserOrdersAction): UserOrdersState => {
  switch (action.type) {
    case WS_USER_ORDERS_CONNECTION_START:
      return {
        ...state,
        error: undefined,
      };

    case WS_USER_ORDERS_CONNECTION_SUCCESS:
      return {
        ...state,
        wsConnected: true,
        error: undefined,
      };

    case WS_USER_ORDERS_CONNECTION_ERROR:
      return {
        ...state,
        wsConnected: false,
        error: action.payload,
      };

    case WS_USER_ORDERS_CONNECTION_CLOSED:
      return {
        ...state,
        wsConnected: false,
        error: undefined,
      };

    case WS_USER_ORDERS_GET_MESSAGE:
      return {
        ...state,
        orders: action.payload.orders || [],
        total: action.payload.total || 0,
        totalToday: action.payload.totalToday || 0,
        error: undefined,
      };

    default:
      return state;
  }
};

export default userOrdersReducer;
