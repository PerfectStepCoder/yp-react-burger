import {
  SET_CONSTRUCTOR_BUN,
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  MOVE_INGREDIENT_IN_CONSTRUCTOR,
  RESET_CONSTRUCTOR,
} from '../actions/burgerConstructorActions';
import { BurgerConstructorState, BurgerConstructorAction } from '../../utils/types';

const initialState: BurgerConstructorState = {
  bun: null,
  fillings: [],
};

const burgerConstructorReducer = (state: BurgerConstructorState = initialState, action: BurgerConstructorAction): BurgerConstructorState => {
  switch (action.type) {
    case SET_CONSTRUCTOR_BUN:
      return {
        ...state,
        bun: action.payload,
      };
    case ADD_INGREDIENT_TO_CONSTRUCTOR:
      return {
        ...state,
        fillings: [...state.fillings, action.payload],
      };
    case REMOVE_INGREDIENT_FROM_CONSTRUCTOR:
      return {
        ...state,
        fillings: state.fillings.filter((item) => item.uuid !== action.payload),
      };
    case MOVE_INGREDIENT_IN_CONSTRUCTOR: {
      const { fromIndex, toIndex } = action.payload;
      const updatedFillings = [...state.fillings];
      const [movedItem] = updatedFillings.splice(fromIndex, 1);

      if (!movedItem) {
        return state;
      }

      updatedFillings.splice(toIndex, 0, movedItem);

      return {
        ...state,
        fillings: updatedFillings,
      };
    }
    case RESET_CONSTRUCTOR:
      return initialState;
    default:
      return state;
  }
};

export default burgerConstructorReducer;
export { initialState as burgerConstructorInitialState };
