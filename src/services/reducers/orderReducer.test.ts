import orderReducer, { orderInitialState } from './orderReducer';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  RESET_ORDER,
} from '../actions/orderActions';
import { Order } from '../../utils/types';

describe('orderReducer', () => {
  const mockOrder: Order = {
    _id: 'order-1',
    number: 12345,
    name: 'Burger',
    status: 'done',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    ingredients: ['ingredient-1', 'ingredient-2'],
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' } as any)).toEqual({
        order: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('CREATE_ORDER_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: CREATE_ORDER_REQUEST } as any;
      const state = orderReducer(orderInitialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should clear existing error', () => {
      const currentState = {
        order: null,
        isLoading: false,
        error: 'Previous error',
      } as any;
      const action = { type: CREATE_ORDER_REQUEST } as any;
      const state = orderReducer(currentState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('CREATE_ORDER_SUCCESS', () => {
    it('should set order and clear loading', () => {
      const action = {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrder,
      } as any;
      const state = orderReducer(
        { ...orderInitialState, isLoading: true },
        action
      );
      expect(state.order).toEqual(mockOrder);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should replace existing order', () => {
      const existingOrder: Order = {
        ...mockOrder,
        number: 11111,
      } as any;
      const newOrder: Order = {
        ...mockOrder,
        number: 22222,
      };
      const currentState = {
        order: existingOrder,
        isLoading: true,
        error: null,
      };
      const action = {
        type: CREATE_ORDER_SUCCESS,
        payload: newOrder,
      } as any;
      const state = orderReducer(currentState, action);
      expect(state.order).toEqual(newOrder);
      expect(state.order?.number).toBe(22222);
    });
  });

  describe('CREATE_ORDER_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: CREATE_ORDER_FAILURE,
        payload: errorMessage,
      } as any;
      const state = orderReducer(
        { ...orderInitialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should not change order on error', () => {
      const currentState = {
        order: mockOrder,
        isLoading: true,
        error: null,
      } as any;
      const errorMessage = 'Failed to create order';
      const action = {
        type: CREATE_ORDER_FAILURE,
        payload: errorMessage,
      } as any;
      const state = orderReducer(currentState, action);
      expect(state.order).toEqual(mockOrder);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('RESET_ORDER', () => {
    it('should reset to initial state', () => {
      const currentState = {
        order: mockOrder,
        isLoading: false,
        error: 'Some error',
      } as any;
      const action = { type: RESET_ORDER } as any;
      const state = orderReducer(currentState, action);
      expect(state).toEqual(orderInitialState);
    });

    it('should reset even if already in initial state', () => {
      const action = { type: RESET_ORDER } as any;
      const state = orderReducer(orderInitialState, action);
      expect(state).toEqual(orderInitialState);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        order: mockOrder,
        isLoading: false,
        error: null,
      } as any;
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const state = orderReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
