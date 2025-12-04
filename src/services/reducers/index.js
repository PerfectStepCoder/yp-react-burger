import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsReducer';
import burgerConstructorReducer from './burgerConstructorReducer';
import currentIngredientReducer from './currentIngredientReducer';
import orderReducer from './orderReducer';
import passwordReducer from './passwordReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
  password: passwordReducer,
  auth: authReducer,
});

export default rootReducer;

