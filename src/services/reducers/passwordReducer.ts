import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_RESET,
} from '../actions/passwordActions';
import { PasswordState, PasswordAction } from '../../utils/types';

const initialState: PasswordState = {
  isLoading: false,
  error: null,
  message: null,
};

const passwordReducer = (state: PasswordState = initialState, action: PasswordAction): PasswordState => {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        message: action.payload,
        error: null,
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        message: null,
      };
    case RESET_PASSWORD_RESET:
      return initialState;
    default:
      return state;
  }
};

export default passwordReducer;
export { initialState as passwordInitialState };
