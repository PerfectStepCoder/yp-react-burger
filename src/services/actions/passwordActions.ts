import { request } from '../../utils/request';
import { RootState } from '../../utils/types';
import {
  ResetPasswordRequestAction,
  ResetPasswordSuccessAction,
  ResetPasswordFailureAction,
  ResetPasswordResetAction,
  PasswordAction,
} from '../../utils/types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const RESET_PASSWORD_RESET = 'RESET_PASSWORD_RESET';

const resetPasswordRequest = (): ResetPasswordRequestAction => ({
  type: RESET_PASSWORD_REQUEST,
});

const resetPasswordSuccess = (message: string): ResetPasswordSuccessAction => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: message,
});

const resetPasswordFailure = (error: string): ResetPasswordFailureAction => ({
  type: RESET_PASSWORD_FAILURE,
  payload: error,
});

export const resetPasswordReset = (): ResetPasswordResetAction => ({
  type: RESET_PASSWORD_RESET,
});

type PasswordThunkAction = ThunkAction<Promise<{ success: boolean; error?: string }>, RootState, unknown, PasswordAction>;

interface PasswordResponse {
  success: boolean;
  message?: string;
}

export const forgotPassword = (email: string): PasswordThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, PasswordAction>) => {
    dispatch(resetPasswordRequest());

    try {
      const response = await request<PasswordResponse>('/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseData = response as unknown as PasswordResponse;
      const message = responseData.message || 'Письмо отправлено';
      dispatch(resetPasswordSuccess(message));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка восстановления пароля';
      dispatch(resetPasswordFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};

export const resetPassword = (password: string, token: string): PasswordThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, PasswordAction>) => {
    dispatch(resetPasswordRequest());

    try {
      const response = await request<PasswordResponse>('/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });

      const responseData = response as unknown as PasswordResponse;
      const message = responseData.message || 'Пароль успешно изменен';
      dispatch(resetPasswordSuccess(message));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сброса пароля';
      dispatch(resetPasswordFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};
