import { Middleware } from 'redux';
import {
  WS_FEED_CONNECTION_START,
  WS_FEED_CONNECTION_SUCCESS,
  WS_FEED_CONNECTION_ERROR,
  WS_FEED_CONNECTION_CLOSED,
  WS_FEED_GET_MESSAGE,
  wsFeedConnectionSuccess,
  wsFeedConnectionError,
  wsFeedConnectionClosed,
  wsFeedGetMessage,
} from '../actions/feedActions';
import {
  WS_USER_ORDERS_CONNECTION_START,
  WS_USER_ORDERS_CONNECTION_SUCCESS,
  WS_USER_ORDERS_CONNECTION_ERROR,
  WS_USER_ORDERS_CONNECTION_CLOSED,
  WS_USER_ORDERS_GET_MESSAGE,
  wsUserOrdersConnectionSuccess,
  wsUserOrdersConnectionError,
  wsUserOrdersConnectionClosed,
  wsUserOrdersGetMessage,
} from '../actions/userOrdersActions';
import { RootState, RootAction } from '../../utils/types';
import { getAccessToken } from '../actions/authActions';

export const socketMiddleware = (): Middleware<{}, RootState> => {
  return (store) => {
    let feedSocket: WebSocket | null = null;
    let userOrdersSocket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const { dispatch, getState } = store;
      const wsAction = action as { type: string; payload?: any };
      const { type, payload } = wsAction;

      // Обработка WebSocket для ленты заказов (всех пользователей)
      if (type === WS_FEED_CONNECTION_START) {
        // Закрываем существующее соединение, если оно есть
        if (feedSocket) {
          feedSocket.onopen = null;
          feedSocket.onerror = null;
          feedSocket.onclose = null;
          feedSocket.onmessage = null;
          try {
            feedSocket.close();
          } catch {
            // Игнорируем ошибки при закрытии
          }
          feedSocket = null;
        }

        const wsBaseUrl = process.env.REACT_APP_WS_BASE_URL || 'wss://norma.education-services.ru';
        const wsUrl = `${wsBaseUrl}/orders/all`;

        feedSocket = new WebSocket(wsUrl);

        feedSocket.onopen = () => {
          dispatch(wsFeedConnectionSuccess() as any);
        };

        feedSocket.onerror = () => {
          dispatch(wsFeedConnectionError('Ошибка WebSocket соединения') as any);
        };

        feedSocket.onclose = () => {
          dispatch(wsFeedConnectionClosed() as any);
        };

        feedSocket.onmessage = (event) => {
          const { data } = event;
          const parsedData = JSON.parse(data);

          if (parsedData.success) {
            dispatch(wsFeedGetMessage(parsedData) as any);
          }
        };
      }

      if (feedSocket && type === WS_FEED_CONNECTION_CLOSED) {
        feedSocket.onopen = null;
        feedSocket.onerror = null;
        feedSocket.onclose = null;
        feedSocket.onmessage = null;

        try {
          feedSocket.close();
        } catch {
          // Игнорируем ошибки при закрытии
        }
        feedSocket = null;
      }

      // Обработка WebSocket для персональных заказов (с авторизацией)
      if (type === WS_USER_ORDERS_CONNECTION_START) {
        // Закрываем существующее соединение, если оно есть
        if (userOrdersSocket) {
          userOrdersSocket.onopen = null;
          userOrdersSocket.onerror = null;
          userOrdersSocket.onclose = null;
          userOrdersSocket.onmessage = null;
          try {
            userOrdersSocket.close();
          } catch {
            // Игнорируем ошибки при закрытии
          }
          userOrdersSocket = null;
        }

        // Получаем токен из payload или из state/cookies
        let accessToken = payload;
        if (!accessToken) {
          const state = getState();
          accessToken = state.auth.accessToken;
        }
        if (!accessToken) {
          // Пытаемся получить из cookies
          accessToken = getAccessToken();
        }

        if (!accessToken) {
          dispatch(wsUserOrdersConnectionError('Токен не найден') as any);
          return next(action);
        }

        // Убираем префикс "Bearer " если он есть (для WebSocket нужен только токен)
        const cleanToken = accessToken.replace(/^Bearer\s+/i, '');

        const wsBaseUrl = process.env.REACT_APP_WS_BASE_URL || 'wss://norma.education-services.ru';
        const wsUrl = `${wsBaseUrl}/orders?token=${cleanToken}`;
        
        console.log('[WebSocket] Подключение к персональным заказам:', wsUrl.replace(cleanToken, '***'));
        
        userOrdersSocket = new WebSocket(wsUrl);

        userOrdersSocket.onopen = () => {
          //console.log('[WebSocket] Соединение с персональными заказами установлено');
          dispatch(wsUserOrdersConnectionSuccess() as any);
        };

        userOrdersSocket.onerror = (error) => {
          //console.error('[WebSocket] Ошибка соединения с персональными заказами:', error);
          dispatch(wsUserOrdersConnectionError('Ошибка WebSocket соединения') as any);
        };

        userOrdersSocket.onclose = (event) => {
          //console.log('[WebSocket] Соединение с персональными заказами закрыто:', event.code, event.reason);
          dispatch(wsUserOrdersConnectionClosed() as any);
        };

        userOrdersSocket.onmessage = (event) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            //console.log('[WebSocket] Получено сообщение от персональных заказов:', parsedData);

            if (parsedData.success) {
              dispatch(wsUserOrdersGetMessage(parsedData) as any);
            } else {
              console.warn('[WebSocket] Сообщение без success:', parsedData);
            }
          } catch (error) {
            console.error('[WebSocket] Ошибка парсинга сообщения:', error, data);
          }
        };
      }

      if (userOrdersSocket && type === WS_USER_ORDERS_CONNECTION_CLOSED) {
        userOrdersSocket.onopen = null;
        userOrdersSocket.onerror = null;
        userOrdersSocket.onclose = null;
        userOrdersSocket.onmessage = null;

        try {
          userOrdersSocket.close();
        } catch {
          // Игнорируем ошибки при закрытии
        }
        userOrdersSocket = null;
      }

      return next(action);
    };
  };
};
