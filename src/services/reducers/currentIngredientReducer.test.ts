import currentIngredientReducer, {
  currentIngredientInitialState,
} from './currentIngredientReducer';
import {
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
} from '../actions/currentIngredientActions';
import { Ingredient } from '../../utils/types';

describe('currentIngredientReducer', () => {
  const mockIngredient: Ingredient = {
    _id: 'ingredient-1',
    name: 'Соус',
    type: 'sauce',
    price: 50,
    image: 'image-url',
    calories: 30,
    proteins: 5,
    fat: 10,
    carbohydrates: 15,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(
        currentIngredientReducer(undefined, { type: 'UNKNOWN_ACTION' })
      ).toEqual({
        item: null,
      });
    });
  });

  describe('SET_CURRENT_INGREDIENT', () => {
    it('should set current ingredient', () => {
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient,
      };
      const state = currentIngredientReducer(
        currentIngredientInitialState,
        action
      );
      expect(state.item).toEqual(mockIngredient);
    });

    it('should replace existing ingredient', () => {
      const newIngredient: Ingredient = {
        ...mockIngredient,
        _id: 'ingredient-2',
        name: 'Новый соус',
      };
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: newIngredient,
      };
      const currentState = {
        item: mockIngredient,
      };
      const state = currentIngredientReducer(currentState, action);
      expect(state.item).toEqual(newIngredient);
    });
  });

  describe('CLEAR_CURRENT_INGREDIENT', () => {
    it('should clear current ingredient', () => {
      const currentState = {
        item: mockIngredient,
      };
      const action = { type: CLEAR_CURRENT_INGREDIENT };
      const state = currentIngredientReducer(currentState, action);
      expect(state).toEqual(currentIngredientInitialState);
    });

    it('should reset to initial state even if already null', () => {
      const action = { type: CLEAR_CURRENT_INGREDIENT };
      const state = currentIngredientReducer(
        currentIngredientInitialState,
        action
      );
      expect(state).toEqual(currentIngredientInitialState);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        item: mockIngredient,
      };
      const action = { type: 'UNKNOWN_ACTION' };
      const state = currentIngredientReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
