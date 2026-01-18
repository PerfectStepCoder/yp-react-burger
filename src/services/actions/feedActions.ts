import { FeedOrder, FeedResponse } from '../../utils/types';

export const WS_FEED_CONNECTION_START = 'WS_FEED_CONNECTION_START';
export const WS_FEED_CONNECTION_SUCCESS = 'WS_FEED_CONNECTION_SUCCESS';
export const WS_FEED_CONNECTION_ERROR = 'WS_FEED_CONNECTION_ERROR';
export const WS_FEED_CONNECTION_CLOSED = 'WS_FEED_CONNECTION_CLOSED';
export const WS_FEED_GET_MESSAGE = 'WS_FEED_GET_MESSAGE';

export interface WsFeedConnectionStartAction {
  type: typeof WS_FEED_CONNECTION_START;
  payload?: string; // URL WebSocket соединения
}

export interface WsFeedConnectionSuccessAction {
  type: typeof WS_FEED_CONNECTION_SUCCESS;
}

export interface WsFeedConnectionErrorAction {
  type: typeof WS_FEED_CONNECTION_ERROR;
  payload: string;
}

export interface WsFeedConnectionClosedAction {
  type: typeof WS_FEED_CONNECTION_CLOSED;
}

export interface WsFeedGetMessageAction {
  type: typeof WS_FEED_GET_MESSAGE;
  payload: FeedResponse;
}

export type FeedAction =
  | WsFeedConnectionStartAction
  | WsFeedConnectionSuccessAction
  | WsFeedConnectionErrorAction
  | WsFeedConnectionClosedAction
  | WsFeedGetMessageAction;

export const wsFeedConnectionStart = (url?: string): WsFeedConnectionStartAction => ({
  type: WS_FEED_CONNECTION_START,
  payload: url,
});

export const wsFeedConnectionSuccess = (): WsFeedConnectionSuccessAction => ({
  type: WS_FEED_CONNECTION_SUCCESS,
});

export const wsFeedConnectionError = (error: string): WsFeedConnectionErrorAction => ({
  type: WS_FEED_CONNECTION_ERROR,
  payload: error,
});

export const wsFeedConnectionClosed = (): WsFeedConnectionClosedAction => ({
  type: WS_FEED_CONNECTION_CLOSED,
});

export const wsFeedGetMessage = (data: FeedResponse): WsFeedGetMessageAction => ({
  type: WS_FEED_GET_MESSAGE,
  payload: data,
});
