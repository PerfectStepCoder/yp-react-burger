import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsReducer';
import burgerConstructorReducer from './burgerConstructorReducer';
import currentIngredientReducer from './currentIngredientReducer';
import orderReducer from './orderReducer';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
});

export default rootReducer;

