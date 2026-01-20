import { v4 as uuidv4 } from 'uuid';
import { Ingredient, ConstructorIngredient } from '../../utils/types';
import {
  SetConstructorBunAction,
  AddIngredientToConstructorAction,
  RemoveIngredientFromConstructorAction,
  MoveIngredientInConstructorAction,
  ResetConstructorAction,
} from '../../utils/types';

export const SET_CONSTRUCTOR_BUN = 'SET_CONSTRUCTOR_BUN';
export const ADD_INGREDIENT_TO_CONSTRUCTOR = 'ADD_INGREDIENT_TO_CONSTRUCTOR';
export const REMOVE_INGREDIENT_FROM_CONSTRUCTOR = 'REMOVE_INGREDIENT_FROM_CONSTRUCTOR';
export const MOVE_INGREDIENT_IN_CONSTRUCTOR = 'MOVE_INGREDIENT_IN_CONSTRUCTOR';
export const RESET_CONSTRUCTOR = 'RESET_CONSTRUCTOR';

export const setConstructorBun = (ingredient: Ingredient): SetConstructorBunAction => ({
  type: SET_CONSTRUCTOR_BUN,
  payload: ingredient,
});

export const addIngredientToConstructor = (ingredient: Ingredient): AddIngredientToConstructorAction => ({
  type: ADD_INGREDIENT_TO_CONSTRUCTOR,
  payload: { ...ingredient, uuid: uuidv4() },
});

export const removeIngredientFromConstructor = (uuid: string): RemoveIngredientFromConstructorAction => ({
  type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  payload: uuid,
});

export const moveIngredientInConstructor = (fromIndex: number, toIndex: number): MoveIngredientInConstructorAction => ({
  type: MOVE_INGREDIENT_IN_CONSTRUCTOR,
  payload: { fromIndex, toIndex },
});

export const resetConstructor = (): ResetConstructorAction => ({
  type: RESET_CONSTRUCTOR,
});
