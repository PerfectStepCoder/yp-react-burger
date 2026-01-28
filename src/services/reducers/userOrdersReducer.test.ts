import userOrdersReducer from './userOrdersReducer';
import {
  WS_USER_ORDERS_CONNECTION_START,
  WS_USER_ORDERS_CONNECTION_SUCCESS,
  WS_USER_ORDERS_CONNECTION_ERROR,
  WS_USER_ORDERS_CONNECTION_CLOSED,
  WS_USER_ORDERS_GET_MESSAGE,
} from '../actions/userOrdersActions';
import { FeedOrder, FeedResponse } from '../../utils/types';

describe('userOrdersReducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    wsConnected: false,
    error: undefined,
  };

  const mockOrder: FeedOrder = {
    _id: 'order-1',
    number: 12345,
    status: 'done',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    ingredients: ['ingredient-1', 'ingredient-2'],
  };

  const mockFeedResponse: FeedResponse = {
    success: true,
    orders: [mockOrder],
    total: 50,
    totalToday: 5,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(
        userOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' } as any)
      ).toEqual(initialState);
    });
  });

  describe('WS_USER_ORDERS_CONNECTION_START', () => {
    it('should clear error', () => {
      const currentState = {
        ...initialState,
        error: 'Previous error',
      };
      const action = { type: WS_USER_ORDERS_CONNECTION_START } as any;
      const state = userOrdersReducer(currentState, action);
      expect(state.error).toBeUndefined();
      expect(state.wsConnected).toBe(false);
    });
  });

  describe('WS_USER_ORDERS_CONNECTION_SUCCESS', () => {
    it('should set wsConnected to true and clear error', () => {
      const action = { type: WS_USER_ORDERS_CONNECTION_SUCCESS } as any;
      const state = userOrdersReducer(initialState, action);
      expect(state.wsConnected).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('should clear error if it exists', () => {
      const currentState = {
        ...initialState,
        error: 'Connection error',
      } as any;
      const action = { type: WS_USER_ORDERS_CONNECTION_SUCCESS } as any;
      const state = userOrdersReducer(currentState, action);
      expect(state.wsConnected).toBe(true);
      expect(state.error).toBeUndefined();
    });
  });

  describe('WS_USER_ORDERS_CONNECTION_ERROR', () => {
    it('should set error and set wsConnected to false', () => {
      const errorMessage = 'Connection failed';
      const action = {
        type: WS_USER_ORDERS_CONNECTION_ERROR,
        payload: errorMessage,
      } as any;
      const currentState = {
        ...initialState,
        wsConnected: true,
      } as any;
      const state = userOrdersReducer(currentState, action);
      expect(state.error).toBe(errorMessage);
      expect(state.wsConnected).toBe(false);
    });
  });

  describe('WS_USER_ORDERS_CONNECTION_CLOSED', () => {
    it('should set wsConnected to false and clear error', () => {
      const currentState = {
        ...initialState,
        wsConnected: true,
        error: 'Some error',
      };
      const action = { type: WS_USER_ORDERS_CONNECTION_CLOSED } as any;
      const state = userOrdersReducer(currentState, action);
      expect(state.wsConnected).toBe(false);
      expect(state.error).toBeUndefined();
    });
  });

  describe('WS_USER_ORDERS_GET_MESSAGE', () => {
    it('should update orders, total, and totalToday', () => {
      const action = {
        type: WS_USER_ORDERS_GET_MESSAGE,
        payload: mockFeedResponse,
      } as any;
      const state = userOrdersReducer(initialState, action);
      expect(state.orders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
      expect(state.error).toBeUndefined();
    });

    it('should handle empty orders array', () => {
      const emptyResponse: FeedResponse = {
        success: true,
        orders: [],
        total: 0,
        totalToday: 0,
      } as any;
      const action = {
        type: WS_USER_ORDERS_GET_MESSAGE,
        payload: emptyResponse,
      } as any;
      const state = userOrdersReducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('should handle missing fields with defaults', () => {
      const partialResponse = {
        success: true,
        orders: undefined,
        total: undefined,
        totalToday: undefined,
      } as any;
      const action = {
        type: WS_USER_ORDERS_GET_MESSAGE,
        payload: partialResponse as FeedResponse,
      } as any;
      const state = userOrdersReducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('should replace existing orders', () => {
      const currentState = {
        ...initialState,
        orders: [mockOrder],
        total: 25,
        totalToday: 3,
      } as any;
      const newOrder: FeedOrder = {
        ...mockOrder,
        _id: 'order-2',
        number: 12346,
      };
      const newResponse: FeedResponse = {
        success: true,
        orders: [newOrder],
        total: 51,
        totalToday: 6,
      };
      const action = {
        type: WS_USER_ORDERS_GET_MESSAGE,
        payload: newResponse,
      } as any;
      const state = userOrdersReducer(currentState, action);
      expect(state.orders).toEqual([newOrder]);
      expect(state.orders).not.toContain(mockOrder);
      expect(state.total).toBe(51);
      expect(state.totalToday).toBe(6);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        ...initialState,
        orders: [mockOrder],
        wsConnected: true,
      } as any;
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const state = userOrdersReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
