import { FeedOrder, FeedResponse } from '../../utils/types';

export const WS_USER_ORDERS_CONNECTION_START = 'WS_USER_ORDERS_CONNECTION_START';
export const WS_USER_ORDERS_CONNECTION_SUCCESS = 'WS_USER_ORDERS_CONNECTION_SUCCESS';
export const WS_USER_ORDERS_CONNECTION_ERROR = 'WS_USER_ORDERS_CONNECTION_ERROR';
export const WS_USER_ORDERS_CONNECTION_CLOSED = 'WS_USER_ORDERS_CONNECTION_CLOSED';
export const WS_USER_ORDERS_GET_MESSAGE = 'WS_USER_ORDERS_GET_MESSAGE';

export interface WsUserOrdersConnectionStartAction {
  type: typeof WS_USER_ORDERS_CONNECTION_START;
  payload?: string; // URL WebSocket соединения (уже с токеном)
}

export interface WsUserOrdersConnectionSuccessAction {
  type: typeof WS_USER_ORDERS_CONNECTION_SUCCESS;
}

export interface WsUserOrdersConnectionErrorAction {
  type: typeof WS_USER_ORDERS_CONNECTION_ERROR;
  payload: string;
}

export interface WsUserOrdersConnectionClosedAction {
  type: typeof WS_USER_ORDERS_CONNECTION_CLOSED;
}

export interface WsUserOrdersGetMessageAction {
  type: typeof WS_USER_ORDERS_GET_MESSAGE;
  payload: FeedResponse;
}

export type UserOrdersAction =
  | WsUserOrdersConnectionStartAction
  | WsUserOrdersConnectionSuccessAction
  | WsUserOrdersConnectionErrorAction
  | WsUserOrdersConnectionClosedAction
  | WsUserOrdersGetMessageAction;

export const wsUserOrdersConnectionStart = (url?: string): WsUserOrdersConnectionStartAction => ({
  type: WS_USER_ORDERS_CONNECTION_START,
  payload: url,
});

export const wsUserOrdersConnectionSuccess = (): WsUserOrdersConnectionSuccessAction => ({
  type: WS_USER_ORDERS_CONNECTION_SUCCESS,
});

export const wsUserOrdersConnectionError = (error: string): WsUserOrdersConnectionErrorAction => ({
  type: WS_USER_ORDERS_CONNECTION_ERROR,
  payload: error,
});

export const wsUserOrdersConnectionClosed = (): WsUserOrdersConnectionClosedAction => ({
  type: WS_USER_ORDERS_CONNECTION_CLOSED,
});

export const wsUserOrdersGetMessage = (data: FeedResponse): WsUserOrdersGetMessageAction => ({
  type: WS_USER_ORDERS_GET_MESSAGE,
  payload: data,
});
