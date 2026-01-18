import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_GET_MESSAGE,
} from '../actions/feedActions';
import { FeedOrder, FeedAction } from '../../utils/types';

export interface FeedState {
  orders: FeedOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  error?: string;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  error: undefined,
};

const feedReducer = (state: FeedState = initialState, action: FeedAction): FeedState => {
  switch (action.type) {
    case WS_FEED_CONNECTION_START:
      return {
        ...state,
        error: undefined,
      };

    case WS_FEED_CONNECTION_SUCCESS:
      return {
        ...state,
        wsConnected: true,
        error: undefined,
      };

    case WS_FEED_CONNECTION_ERROR:
      return {
        ...state,
        wsConnected: false,
        error: action.payload,
      };

    case WS_FEED_CONNECTION_CLOSED:
      return {
        ...state,
        wsConnected: false,
        error: undefined,
      };

    case WS_FEED_GET_MESSAGE:
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

export default feedReducer;
