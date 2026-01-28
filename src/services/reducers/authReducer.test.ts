import authReducer from './authReducer';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
} as any;
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
import { User } from '../../utils/types';

describe('authReducer', () => {
  const mockUser: User = {
    email: 'test@example.com',
    name: 'Test User',
  } as any;

  const mockTokens = {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
  } as any;

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'UNKNOWN_ACTION' } as any)).toEqual({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
    });
  });

  describe('REGISTER_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: REGISTER_REQUEST } as any;
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('REGISTER_SUCCESS', () => {
    it('should set user, tokens, isAuthenticated and clear loading', () => {
      const action = {
        type: REGISTER_SUCCESS,
        payload: {
          user: mockUser,
          ...mockTokens,
        },
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockTokens.accessToken);
      expect(state.refreshToken).toBe(mockTokens.refreshToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('REGISTER_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: REGISTER_FAILURE,
        payload: errorMessage,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('LOGIN_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: LOGIN_REQUEST } as any;
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should set user, tokens, isAuthenticated and clear loading', () => {
      const action = {
        type: LOGIN_SUCCESS,
        payload: {
          user: mockUser,
          ...mockTokens,
        },
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockTokens.accessToken);
      expect(state.refreshToken).toBe(mockTokens.refreshToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('LOGIN_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: LOGIN_FAILURE,
        payload: errorMessage,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('LOGOUT_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: LOGOUT_REQUEST } as any;
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('LOGOUT_SUCCESS', () => {
    it('should reset state to initial state', () => {
      const action = { type: LOGOUT_SUCCESS } as any;
      const currentState = {
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      } as any;
      const state = authReducer(currentState, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('LOGOUT_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Logout failed';
      const action = {
        type: LOGOUT_FAILURE,
        payload: errorMessage,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('UPDATE_TOKEN_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: UPDATE_TOKEN_REQUEST } as any;
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('UPDATE_TOKEN_SUCCESS', () => {
    it('should update tokens and clear loading', () => {
      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      } as any;
      const action = {
        type: UPDATE_TOKEN_SUCCESS,
        payload: newTokens,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.accessToken).toBe(newTokens.accessToken);
      expect(state.refreshToken).toBe(newTokens.refreshToken);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('UPDATE_TOKEN_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Token update failed';
      const action = {
        type: UPDATE_TOKEN_FAILURE,
        payload: errorMessage,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('GET_USER_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: GET_USER_REQUEST } as any;
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('GET_USER_SUCCESS', () => {
    it('should set user, isAuthenticated and clear loading', () => {
      const action = {
        type: GET_USER_SUCCESS,
        payload: mockUser,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('GET_USER_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Get user failed';
      const action = {
        type: GET_USER_FAILURE,
        payload: errorMessage,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('UPDATE_USER_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: UPDATE_USER_REQUEST } as any;
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('UPDATE_USER_SUCCESS', () => {
    it('should update user, set isAuthenticated and clear loading', () => {
      const updatedUser: User = {
        email: 'updated@example.com',
        name: 'Updated User',
      } as any;
      const action = {
        type: UPDATE_USER_SUCCESS,
        payload: updatedUser,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.user).toEqual(updatedUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('UPDATE_USER_FAILURE', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Update user failed';
      const action = {
        type: UPDATE_USER_FAILURE,
        payload: errorMessage,
      } as any;
      const state = authReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('INIT_AUTH', () => {
    it('should set tokens without changing other state', () => {
      const action = {
        type: INIT_AUTH,
        payload: mockTokens,
      } as any;
      const currentState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
      } as any;
      const state = authReducer(currentState, action);
      expect(state.accessToken).toBe(mockTokens.accessToken);
      expect(state.refreshToken).toBe(mockTokens.refreshToken);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      } as any;
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const state = authReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
