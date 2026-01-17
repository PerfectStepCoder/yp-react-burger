import {
  FETCH_INGREDIENTS_REQUEST,
  FETCH_INGREDIENTS_SUCCESS,
  FETCH_INGREDIENTS_FAILURE,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESET_INGREDIENT_COUNTS,
} from '../actions/ingredientsActions';
import { IngredientsState, IngredientsAction } from '../../utils/types';

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

const ingredientsReducer = (state: IngredientsState = initialState, action: IngredientsAction): IngredientsState => {
  switch (action.type) {
    case FETCH_INGREDIENTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_INGREDIENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload.map((item) => ({
          ...item,
          count: 0,
        })),
      };
    case FETCH_INGREDIENTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case INCREMENT_INGREDIENT_COUNT:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, count: (item.count || 0) + action.payload.amount }
            : item,
        ),
      };
    case DECREMENT_INGREDIENT_COUNT:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? {
                ...item,
                count: Math.max(0, (item.count || 0) - action.payload.amount),
              }
            : item,
        ),
      };
    case RESET_INGREDIENT_COUNTS:
      return {
        ...state,
        items: state.items.map((item) => ({
          ...item,
          count: 0,
        })),
      };
    default:
      return state;
  }
};

export default ingredientsReducer;
export { initialState as ingredientsInitialState };
