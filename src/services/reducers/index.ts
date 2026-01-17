import { combineReducers, Reducer } from 'redux';
import ingredientsReducer from './ingredientsReducer';
import burgerConstructorReducer from './burgerConstructorReducer';
import currentIngredientReducer from './currentIngredientReducer';
import orderReducer from './orderReducer';
import passwordReducer from './passwordReducer';
import authReducer from './authReducer';
import { RootState, RootAction } from '../../utils/types';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer as Reducer<RootState['ingredients'], RootAction>,
  burgerConstructor: burgerConstructorReducer as Reducer<RootState['burgerConstructor'], RootAction>,
  currentIngredient: currentIngredientReducer as Reducer<RootState['currentIngredient'], RootAction>,
  order: orderReducer as Reducer<RootState['order'], RootAction>,
  password: passwordReducer as Reducer<RootState['password'], RootAction>,
  auth: authReducer as Reducer<RootState['auth'], RootAction>,
});

export default rootReducer;
