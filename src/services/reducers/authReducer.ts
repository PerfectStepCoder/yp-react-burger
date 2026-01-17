import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  UPDATE_TOKEN_REQUEST,
  UPDATE_TOKEN_SUCCESS,
  UPDATE_TOKEN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  INIT_AUTH,
} from '../actions/authActions';
import { AuthState, AuthAction } from '../../utils/types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
    case UPDATE_TOKEN_REQUEST:
    case GET_USER_REQUEST:
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        error: null,
      };

    case UPDATE_TOKEN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };

    case GET_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };

    case LOGOUT_SUCCESS:
      return {
        ...initialState,
      };

    case INIT_AUTH:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case LOGOUT_FAILURE:
    case UPDATE_TOKEN_FAILURE:
    case GET_USER_FAILURE:
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default authReducer;
