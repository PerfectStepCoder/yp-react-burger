import { request } from '../../utils/request';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const RESET_PASSWORD_RESET = 'RESET_PASSWORD_RESET';

const resetPasswordRequest = () => ({
  type: RESET_PASSWORD_REQUEST,
});

const resetPasswordSuccess = (message) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: message,
});

const resetPasswordFailure = (error) => ({
  type: RESET_PASSWORD_FAILURE,
  payload: error,
});

export const resetPasswordReset = () => ({
  type: RESET_PASSWORD_RESET,
});

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(resetPasswordRequest());

  try {
    const data = await request('/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    dispatch(resetPasswordSuccess(data.message));
    return { success: true };
  } catch (error) {
    dispatch(resetPasswordFailure(error.message || 'Ошибка восстановления пароля'));
    return { success: false, error: error.message || 'Ошибка восстановления пароля' };
  }
};

export const resetPassword = (password, token) => async (dispatch) => {
  dispatch(resetPasswordRequest());

  try {
    const data = await request('/password-reset/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, token }),
    });

    dispatch(resetPasswordSuccess(data.message));
    return { success: true };
  } catch (error) {
    dispatch(resetPasswordFailure(error.message || 'Ошибка сброса пароля'));
    return { success: false, error: error.message || 'Ошибка сброса пароля' };
  }
};






