import {
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
} from '../actions/currentIngredientActions';
import { CurrentIngredientState, CurrentIngredientAction } from '../../utils/types';

const initialState: CurrentIngredientState = {
  item: null,
};

const currentIngredientReducer = (state: CurrentIngredientState = initialState, action: CurrentIngredientAction): CurrentIngredientState => {
  switch (action.type) {
    case SET_CURRENT_INGREDIENT:
      return {
        ...state,
        item: action.payload,
      };
    case CLEAR_CURRENT_INGREDIENT:
      return initialState;
    default:
      return state;
  }
};

export default currentIngredientReducer;
export { initialState as currentIngredientInitialState };
