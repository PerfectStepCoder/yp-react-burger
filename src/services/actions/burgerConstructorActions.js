import { v4 as uuidv4 } from 'uuid';

export const SET_CONSTRUCTOR_BUN = 'SET_CONSTRUCTOR_BUN';
export const ADD_INGREDIENT_TO_CONSTRUCTOR = 'ADD_INGREDIENT_TO_CONSTRUCTOR';
export const REMOVE_INGREDIENT_FROM_CONSTRUCTOR = 'REMOVE_INGREDIENT_FROM_CONSTRUCTOR';
export const MOVE_INGREDIENT_IN_CONSTRUCTOR = 'MOVE_INGREDIENT_IN_CONSTRUCTOR';
export const RESET_CONSTRUCTOR = 'RESET_CONSTRUCTOR';

export const setConstructorBun = (ingredient) => ({
  type: SET_CONSTRUCTOR_BUN,
  payload: ingredient,
});

export const addIngredientToConstructor = (ingredient) => ({
  type: ADD_INGREDIENT_TO_CONSTRUCTOR,
  payload: { ...ingredient, uuid: uuidv4() },
});

export const removeIngredientFromConstructor = (uuid) => ({
  type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  payload: uuid,
});

export const moveIngredientInConstructor = (fromIndex, toIndex) => ({
  type: MOVE_INGREDIENT_IN_CONSTRUCTOR,
  payload: { fromIndex, toIndex },
});

export const resetConstructor = () => ({
  type: RESET_CONSTRUCTOR,
});

