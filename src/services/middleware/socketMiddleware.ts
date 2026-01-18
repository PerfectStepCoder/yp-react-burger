import { Middleware } from 'redux';
import { RootState, RootAction } from '../../utils/types';

// Интерфейс для конфигурации WebSocket соединения
export interface WsConfig {
  wsInit: string;        // Тип экшена для инициализации соединения
  onOpen: string;        // Тип экшена при открытии соединения
  onError: string;       // Тип экшена при ошибке
  onClose: string;       // Тип экшена при закрытии соединения
  onMessage: string;     // Тип экшена при получении сообщения
}

// Интерфейс для payload при старте соединения
export interface WsConnectionStartPayload {
  url: string;           // Полный URL WebSocket соединения (уже с токеном, если нужно)
}

/**
 * Универсальный WebSocket middleware
 */
export const socketMiddleware = (wsConfig: WsConfig): Middleware<{}, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const { dispatch } = store;
      const wsAction = action as { type: string; payload?: any };
      const { type, payload } = wsAction;

      // Инициализация соединения
      if (type === wsConfig.wsInit) {
        // Закрываем существующее соединение, если оно есть
        if (socket) {
          socket.onopen = null;
          socket.onerror = null;
          socket.onclose = null;
          socket.onmessage = null;
          try {
            socket.close();
          } catch {
            // Игнорируем ошибки при закрытии
          }
          socket = null;
        }

        // Получаем URL из payload
        const connectionPayload = payload as WsConnectionStartPayload | string;
        const wsUrl = typeof connectionPayload === 'string' 
          ? connectionPayload 
          : connectionPayload?.url;

        if (!wsUrl) {
          dispatch({
            type: wsConfig.onError,
            payload: 'URL WebSocket соединения не указан',
          } as any);
          return next(action);
        }

        // Создаем новое соединение
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          dispatch({
            type: wsConfig.onOpen,
          } as any);
        };

        socket.onerror = () => {
          dispatch({
            type: wsConfig.onError,
            payload: 'Ошибка WebSocket соединения',
          } as any);
        };

        socket.onclose = () => {
          dispatch({
            type: wsConfig.onClose,
          } as any);
        };

        socket.onmessage = (event) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            
            // Диспатчим сообщение, если есть поле success или просто передаем данные как есть
            dispatch({
              type: wsConfig.onMessage,
              payload: parsedData,
            } as any);
          } catch (error) {
            console.error('[WebSocket] Ошибка парсинга сообщения:', error, data);
            dispatch({
              type: wsConfig.onError,
              payload: 'Ошибка парсинга сообщения WebSocket',
            } as any);
          }
        };
      }

      // Закрытие соединения
      if (socket && type === wsConfig.onClose) {
        socket.onopen = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.onmessage = null;

        try {
          socket.close();
        } catch {
          // Игнорируем ошибки при закрытии
        }
        socket = null;
      }

      return next(action);
    };
  };
};
