// Mock uuid before importing reducer
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

import burgerConstructorReducer, { burgerConstructorInitialState } from './burgerConstructorReducer';
import {
  SET_CONSTRUCTOR_BUN,
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  MOVE_INGREDIENT_IN_CONSTRUCTOR,
  RESET_CONSTRUCTOR,
} from '../actions/burgerConstructorActions';
import { Ingredient, ConstructorIngredient } from '../../utils/types';

describe('burgerConstructorReducer', () => {
  const mockBun: Ingredient = {
    _id: 'bun-1',
    name: 'Краторная булка',
    type: 'bun',
    price: 1255,
    image: 'image-url',
    calories: 420,
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
  };

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

  const mockConstructorIngredient: ConstructorIngredient = {
    ...mockIngredient,
    uuid: 'uuid-1',
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(
        burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' } as any)
      ).toEqual({
        bun: null,
        fillings: [],
      });
    });
  });

  describe('SET_CONSTRUCTOR_BUN', () => {
    it('should set bun', () => {
      const action = {
        type: SET_CONSTRUCTOR_BUN,
        payload: mockBun,
      } as any;
      const state = burgerConstructorReducer(
        burgerConstructorInitialState,
        action
      );
      expect(state.bun).toEqual(mockBun);
      expect(state.fillings).toEqual([]);
    });

    it('should replace existing bun', () => {
      const newBun: Ingredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Новая булка',
      } as any;
      const action = {
        type: SET_CONSTRUCTOR_BUN,
        payload: newBun,
      } as any;
      const currentState = {
        bun: mockBun,
        fillings: [],
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state.bun).toEqual(newBun);
    });
  });

  describe('ADD_INGREDIENT_TO_CONSTRUCTOR', () => {
    it('should add ingredient to fillings', () => {
      const action = {
        type: ADD_INGREDIENT_TO_CONSTRUCTOR,
        payload: mockConstructorIngredient,
      } as any;
      const state = burgerConstructorReducer(
        burgerConstructorInitialState,
        action
      );
      expect(state.fillings).toHaveLength(1);
      expect(state.fillings[0]).toEqual(mockConstructorIngredient);
    });

    it('should add multiple ingredients', () => {
      const secondIngredient: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-2',
        uuid: 'uuid-2',
      } as any;
      const action1 = {
        type: ADD_INGREDIENT_TO_CONSTRUCTOR,
        payload: mockConstructorIngredient,
      } as any;
      const action2 = {
        type: ADD_INGREDIENT_TO_CONSTRUCTOR,
        payload: secondIngredient,
      } as any;
      let state = burgerConstructorReducer(
        burgerConstructorInitialState,
        action1
      );
      state = burgerConstructorReducer(state, action2);
      expect(state.fillings).toHaveLength(2);
      expect(state.fillings[0]).toEqual(mockConstructorIngredient);
      expect(state.fillings[1]).toEqual(secondIngredient);
    });
  });

  describe('REMOVE_INGREDIENT_FROM_CONSTRUCTOR', () => {
    it('should remove ingredient by uuid', () => {
      const currentState = {
        bun: mockBun,
        fillings: [mockConstructorIngredient],
      } as any;
      const action = {
        type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
        payload: 'uuid-1',
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state.fillings).toHaveLength(0);
    });

    it('should not remove if uuid does not match', () => {
      const currentState = {
        bun: mockBun,
        fillings: [mockConstructorIngredient],
      } as any;
      const action = {
        type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
        payload: 'non-existent-uuid',
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state.fillings).toHaveLength(1);
      expect(state.fillings[0]).toEqual(mockConstructorIngredient);
    });

    it('should remove correct ingredient from multiple', () => {
      const secondIngredient: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-2',
        uuid: 'uuid-2',
      } as any;
      const currentState = {
        bun: mockBun,
        fillings: [mockConstructorIngredient, secondIngredient],
      };
      const action = {
        type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
        payload: 'uuid-1',
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state.fillings).toHaveLength(1);
      expect(state.fillings[0]).toEqual(secondIngredient);
    });
  });

  describe('MOVE_INGREDIENT_IN_CONSTRUCTOR', () => {
    it('should move ingredient from one position to another', () => {
      const ingredient1: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-1',
        uuid: 'uuid-1',
      } as any;
      const ingredient2: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-2',
        uuid: 'uuid-2',
      };
      const ingredient3: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-3',
        uuid: 'uuid-3',
      };
      const currentState = {
        bun: mockBun,
        fillings: [ingredient1, ingredient2, ingredient3],
      };
      const action = {
        type: MOVE_INGREDIENT_IN_CONSTRUCTOR,
        payload: { fromIndex: 0, toIndex: 2 },
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state.fillings[0]).toEqual(ingredient2);
      expect(state.fillings[1]).toEqual(ingredient3);
      expect(state.fillings[2]).toEqual(ingredient1);
    });

    it('should not change state if fromIndex is invalid', () => {
      const currentState = {
        bun: mockBun,
        fillings: [mockConstructorIngredient],
      } as any;
      const action = {
        type: MOVE_INGREDIENT_IN_CONSTRUCTOR,
        payload: { fromIndex: 10, toIndex: 0 },
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state).toEqual(currentState);
    });

    it('should move ingredient to the end', () => {
      const ingredient1: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-1',
        uuid: 'uuid-1',
      } as any;
      const ingredient2: ConstructorIngredient = {
        ...mockIngredient,
        _id: 'ingredient-2',
        uuid: 'uuid-2',
      };
      const currentState = {
        bun: mockBun,
        fillings: [ingredient1, ingredient2],
      };
      const action = {
        type: MOVE_INGREDIENT_IN_CONSTRUCTOR,
        payload: { fromIndex: 0, toIndex: 1 },
      } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state.fillings[0]).toEqual(ingredient2);
      expect(state.fillings[1]).toEqual(ingredient1);
    });
  });

  describe('RESET_CONSTRUCTOR', () => {
    it('should reset to initial state', () => {
      const currentState = {
        bun: mockBun,
        fillings: [mockConstructorIngredient],
      } as any;
      const action = { type: RESET_CONSTRUCTOR } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state).toEqual(burgerConstructorInitialState);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        bun: mockBun,
        fillings: [mockConstructorIngredient],
      } as any;
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const state = burgerConstructorReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
