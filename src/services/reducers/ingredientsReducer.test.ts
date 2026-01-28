import ingredientsReducer, {
  ingredientsInitialState,
} from './ingredientsReducer';
import {
  FETCH_INGREDIENTS_REQUEST,
  FETCH_INGREDIENTS_SUCCESS,
  FETCH_INGREDIENTS_FAILURE,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESET_INGREDIENT_COUNTS,
} from '../actions/ingredientsActions';
import { Ingredient } from '../../utils/types';

describe('ingredientsReducer', () => {
  const mockIngredient1: Ingredient = {
    _id: 'ingredient-1',
    name: 'Соус',
    type: 'sauce',
    price: 50,
    image: 'image-url-1',
    calories: 30,
    proteins: 5,
    fat: 10,
    carbohydrates: 15,
  };

  const mockIngredient2: Ingredient = {
    _id: 'ingredient-2',
    name: 'Булка',
    type: 'bun',
    price: 100,
    image: 'image-url-2',
    calories: 200,
    proteins: 10,
    fat: 5,
    carbohydrates: 30,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(
        ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })
      ).toEqual({
        items: [],
        isLoading: false,
        error: null,
      });
    });
  });

  describe('FETCH_INGREDIENTS_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: FETCH_INGREDIENTS_REQUEST };
      const state = ingredientsReducer(ingredientsInitialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should clear existing error', () => {
      const currentState = {
        ...ingredientsInitialState,
        error: 'Previous error',
      };
      const action = { type: FETCH_INGREDIENTS_REQUEST };
      const state = ingredientsReducer(currentState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('FETCH_INGREDIENTS_SUCCESS', () => {
    it('should set items with count 0 and clear loading', () => {
      const ingredients = [mockIngredient1, mockIngredient2];
      const action = {
        type: FETCH_INGREDIENTS_SUCCESS,
        payload: ingredients,
      };
      const state = ingredientsReducer(
        { ...ingredientsInitialState, isLoading: true },
        action
      );
      expect(state.items).toHaveLength(2);
      expect(state.items[0]).toEqual({ ...mockIngredient1, count: 0 });
      expect(state.items[1]).toEqual({ ...mockIngredient2, count: 0 });
      expect(state.isLoading).toBe(false);
    });

    it('should replace existing items', () => {
      const currentState = {
        items: [mockIngredient1],
        isLoading: true,
        error: null,
      };
      const newIngredients = [mockIngredient2];
      const action = {
        type: FETCH_INGREDIENTS_SUCCESS,
        payload: newIngredients,
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...mockIngredient2, count: 0 });
    });
  });

  describe('FETCH_INGREDIENTS_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const action = {
        type: FETCH_INGREDIENTS_FAILURE,
        payload: errorMessage,
      };
      const state = ingredientsReducer(
        { ...ingredientsInitialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('INCREMENT_INGREDIENT_COUNT', () => {
    it('should increment count for matching ingredient', () => {
      const currentState = {
        items: [
          { ...mockIngredient1, count: 0 },
          { ...mockIngredient2, count: 0 },
        ],
        isLoading: false,
        error: null,
      };
      const action = {
        type: INCREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 1 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(1);
      expect(state.items[1].count).toBe(0);
    });

    it('should increment by specified amount', () => {
      const currentState = {
        items: [{ ...mockIngredient1, count: 2 }],
        isLoading: false,
        error: null,
      };
      const action = {
        type: INCREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 3 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(5);
    });

    it('should handle undefined count', () => {
      const currentState = {
        items: [{ ...mockIngredient1 }], // count is undefined
        isLoading: false,
        error: null,
      };
      const action = {
        type: INCREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 2 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(2);
    });

    it('should not change non-matching ingredients', () => {
      const currentState = {
        items: [
          { ...mockIngredient1, count: 1 },
          { ...mockIngredient2, count: 2 },
        ],
        isLoading: false,
        error: null,
      };
      const action = {
        type: INCREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 1 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(2);
      expect(state.items[1].count).toBe(2);
    });
  });

  describe('DECREMENT_INGREDIENT_COUNT', () => {
    it('should decrement count for matching ingredient', () => {
      const currentState = {
        items: [
          { ...mockIngredient1, count: 5 },
          { ...mockIngredient2, count: 3 },
        ],
        isLoading: false,
        error: null,
      };
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 1 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(4);
      expect(state.items[1].count).toBe(3);
    });

    it('should decrement by specified amount', () => {
      const currentState = {
        items: [{ ...mockIngredient1, count: 5 }],
        isLoading: false,
        error: null,
      };
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 2 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(3);
    });

    it('should not go below 0', () => {
      const currentState = {
        items: [{ ...mockIngredient1, count: 1 }],
        isLoading: false,
        error: null,
      };
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 5 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(0);
    });

    it('should handle undefined count', () => {
      const currentState = {
        items: [{ ...mockIngredient1 }], // count is undefined
        isLoading: false,
        error: null,
      };
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: { id: 'ingredient-1', amount: 1 },
      };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(0);
    });
  });

  describe('RESET_INGREDIENT_COUNTS', () => {
    it('should reset all counts to 0', () => {
      const currentState = {
        items: [
          { ...mockIngredient1, count: 5 },
          { ...mockIngredient2, count: 3 },
        ],
        isLoading: false,
        error: null,
      };
      const action = { type: RESET_INGREDIENT_COUNTS };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(0);
      expect(state.items[1].count).toBe(0);
    });

    it('should handle items with undefined count', () => {
      const currentState = {
        items: [
          { ...mockIngredient1, count: 5 },
          { ...mockIngredient2 }, // count is undefined
        ],
        isLoading: false,
        error: null,
      };
      const action = { type: RESET_INGREDIENT_COUNTS };
      const state = ingredientsReducer(currentState, action);
      expect(state.items[0].count).toBe(0);
      expect(state.items[1].count).toBe(0);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        items: [mockIngredient1],
        isLoading: false,
        error: null,
      };
      const action = { type: 'UNKNOWN_ACTION' };
      const state = ingredientsReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
