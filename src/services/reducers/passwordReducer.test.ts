import passwordReducer, { passwordInitialState } from './passwordReducer';
import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_RESET,
} from '../actions/passwordActions';

describe('passwordReducer', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(
        passwordReducer(undefined, { type: 'UNKNOWN_ACTION' })
      ).toEqual({
        isLoading: false,
        error: null,
        message: null,
      });
    });
  });

  describe('RESET_PASSWORD_REQUEST', () => {
    it('should set isLoading to true and clear error', () => {
      const action = { type: RESET_PASSWORD_REQUEST };
      const state = passwordReducer(passwordInitialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should clear existing error', () => {
      const currentState = {
        isLoading: false,
        error: 'Previous error',
        message: null,
      };
      const action = { type: RESET_PASSWORD_REQUEST };
      const state = passwordReducer(currentState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('RESET_PASSWORD_SUCCESS', () => {
    it('should set message and clear loading and error', () => {
      const successMessage = 'Password reset email sent';
      const action = {
        type: RESET_PASSWORD_SUCCESS,
        payload: successMessage,
      };
      const state = passwordReducer(
        { ...passwordInitialState, isLoading: true },
        action
      );
      expect(state.message).toBe(successMessage);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should replace existing message', () => {
      const currentState = {
        isLoading: true,
        error: null,
        message: 'Old message',
      };
      const newMessage = 'New message';
      const action = {
        type: RESET_PASSWORD_SUCCESS,
        payload: newMessage,
      };
      const state = passwordReducer(currentState, action);
      expect(state.message).toBe(newMessage);
    });
  });

  describe('RESET_PASSWORD_FAILURE', () => {
    it('should set error and clear loading and message', () => {
      const errorMessage = 'Failed to reset password';
      const action = {
        type: RESET_PASSWORD_FAILURE,
        payload: errorMessage,
      };
      const state = passwordReducer(
        {
          ...passwordInitialState,
          isLoading: true,
          message: 'Some message',
        },
        action
      );
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.message).toBe(null);
    });

    it('should clear message on error', () => {
      const currentState = {
        isLoading: true,
        error: null,
        message: 'Success message',
      };
      const errorMessage = 'Error occurred';
      const action = {
        type: RESET_PASSWORD_FAILURE,
        payload: errorMessage,
      };
      const state = passwordReducer(currentState, action);
      expect(state.message).toBe(null);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('RESET_PASSWORD_RESET', () => {
    it('should reset to initial state', () => {
      const currentState = {
        isLoading: true,
        error: 'Some error',
        message: 'Some message',
      };
      const action = { type: RESET_PASSWORD_RESET };
      const state = passwordReducer(currentState, action);
      expect(state).toEqual(passwordInitialState);
    });

    it('should reset even if already in initial state', () => {
      const action = { type: RESET_PASSWORD_RESET };
      const state = passwordReducer(passwordInitialState, action);
      expect(state).toEqual(passwordInitialState);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const currentState = {
        isLoading: false,
        error: null,
        message: 'Some message',
      };
      const action = { type: 'UNKNOWN_ACTION' };
      const state = passwordReducer(currentState, action);
      expect(state).toEqual(currentState);
    });
  });
});
