import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  RESET_ORDER,
} from '../actions/orderActions';

const initialState = {
  order: null,
  isLoading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        order: action.payload,
      };
    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case RESET_ORDER:
      return initialState;
    default:
      return state;
  }
};

export default orderReducer;
export { initialState as orderInitialState };

