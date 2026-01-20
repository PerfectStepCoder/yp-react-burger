import { request } from '../../utils/request';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookies';
import { 
  User,
  AuthAction,
  RegisterRequestAction,
  RegisterSuccessAction,
  RegisterFailureAction,
  LoginRequestAction,
  LoginSuccessAction,
  LoginFailureAction,
  LogoutRequestAction,
  LogoutSuccessAction,
  LogoutFailureAction,
  UpdateTokenRequestAction,
  UpdateTokenSuccessAction,
  UpdateTokenFailureAction,
  GetUserRequestAction,
  GetUserSuccessAction,
  GetUserFailureAction,
  UpdateUserRequestAction,
  UpdateUserSuccessAction,
  UpdateUserFailureAction,
  InitAuthAction,
  RootState
} from '../../utils/types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const UPDATE_TOKEN_REQUEST = 'UPDATE_TOKEN_REQUEST';
export const UPDATE_TOKEN_SUCCESS = 'UPDATE_TOKEN_SUCCESS';
export const UPDATE_TOKEN_FAILURE = 'UPDATE_TOKEN_FAILURE';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const INIT_AUTH = 'INIT_AUTH';

type AuthThunkAction = ThunkAction<Promise<{ success: boolean; error?: string | null; accessToken?: string; user?: User }>, RootState, unknown, AuthAction>;

const registerRequest = (): RegisterRequestAction => ({
  type: REGISTER_REQUEST,
});

const registerSuccess = (user: User, accessToken: string, refreshToken: string): RegisterSuccessAction => ({
  type: REGISTER_SUCCESS,
  payload: { user, accessToken, refreshToken },
});

const registerFailure = (error: string): RegisterFailureAction => ({
  type: REGISTER_FAILURE,
  payload: error,
});

const loginRequest = (): LoginRequestAction => ({
  type: LOGIN_REQUEST,
});

const loginSuccess = (user: User, accessToken: string, refreshToken: string): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: { user, accessToken, refreshToken },
});

const loginFailure = (error: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload: error,
});

const logoutRequest = (): LogoutRequestAction => ({
  type: LOGOUT_REQUEST,
});

const logoutSuccess = (): LogoutSuccessAction => ({
  type: LOGOUT_SUCCESS,
});

const logoutFailure = (error: string): LogoutFailureAction => ({
  type: LOGOUT_FAILURE,
  payload: error,
});

const updateTokenRequest = (): UpdateTokenRequestAction => ({
  type: UPDATE_TOKEN_REQUEST,
});

const updateTokenSuccess = (accessToken: string, refreshToken: string): UpdateTokenSuccessAction => ({
  type: UPDATE_TOKEN_SUCCESS,
  payload: { accessToken, refreshToken },
});

const updateTokenFailure = (error: string): UpdateTokenFailureAction => ({
  type: UPDATE_TOKEN_FAILURE,
  payload: error,
});

const getUserRequest = (): GetUserRequestAction => ({
  type: GET_USER_REQUEST,
});

const getUserSuccess = (user: User): GetUserSuccessAction => ({
  type: GET_USER_SUCCESS,
  payload: user,
});

const getUserFailure = (error: string | null): GetUserFailureAction => ({
  type: GET_USER_FAILURE,
  payload: error,
});

const updateUserRequest = (): UpdateUserRequestAction => ({
  type: UPDATE_USER_REQUEST,
});

const updateUserSuccess = (user: User): UpdateUserSuccessAction => ({
  type: UPDATE_USER_SUCCESS,
  payload: user,
});

const updateUserFailure = (error: string): UpdateUserFailureAction => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

// Сохранение refreshToken в куки
const saveRefreshToken = (token: string): void => {
  setCookie('refreshToken', token, 7); // Храним 7 дней
};

// Сохранение accessToken в куки
const saveAccessToken = (token: string): void => {
  setCookie('accessToken', token, 1); // Храним 1 день (токен живет 20 минут, но на всякий случай)
};

// Удаление refreshToken из кук
const removeRefreshToken = (): void => {
  deleteCookie('refreshToken');
};

// Удаление accessToken из кук
const removeAccessToken = (): void => {
  deleteCookie('accessToken');
};

// Получение refreshToken из кук
const getRefreshToken = (): string | null => {
  return getCookie('refreshToken');
};

// Получение accessToken из кук
const getAccessToken = (): string | null => {
  return getCookie('accessToken');
};

// Функция для создания заголовков с токеном
const getAuthHeaders = (accessToken: string | null): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: accessToken }),
  };
};

interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface TokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

interface UserResponse {
  success: boolean;
  user: User;
}

// Регистрация
export const register = (email: string, password: string, name: string): AuthThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, AuthAction>) => {
    dispatch(registerRequest());

    try {
      const response = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const { user, accessToken, refreshToken } = response as unknown as AuthResponse;
      saveRefreshToken(refreshToken);
      saveAccessToken(accessToken);
      dispatch(registerSuccess(user, accessToken, refreshToken));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации';
      dispatch(registerFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};

// Авторизация
export const login = (email: string, password: string): AuthThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, AuthAction>) => {
    dispatch(loginRequest());

    try {
      const response = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const { user, accessToken, refreshToken } = response as unknown as AuthResponse;
      saveRefreshToken(refreshToken);
      saveAccessToken(accessToken);
      dispatch(loginSuccess(user, accessToken, refreshToken));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка авторизации';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};

// Выход из системы
export const logout = (): AuthThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, AuthAction>) => {
    dispatch(logoutRequest());

    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const response = await request<{ success: boolean }>('/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: refreshToken }),
        });
        const data = response as unknown as { success: boolean };
        // Сервер вернул успешный ответ
        if (data.success) {
          removeRefreshToken();
          removeAccessToken();
          dispatch(logoutSuccess());
          return { success: true };
        }
      }
      // Если refreshToken отсутствует, все равно очищаем состояние
      removeRefreshToken();
      removeAccessToken();
      dispatch(logoutSuccess());
      return { success: true };
    } catch (error) {
      // Даже при ошибке очищаем локальное состояние
      removeRefreshToken();
      removeAccessToken();
      dispatch(logoutSuccess());
      return { success: true };
    }
  };
};

// Обновление токена
export const updateToken = (): AuthThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, AuthAction>) => {
    dispatch(updateTokenRequest());

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token не найден');
      }

      const response = await request<TokenResponse>('/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      const { accessToken, refreshToken: newRefreshToken } = response as unknown as TokenResponse;
      saveRefreshToken(newRefreshToken);
      saveAccessToken(accessToken);
      dispatch(updateTokenSuccess(accessToken, newRefreshToken));
      return { success: true, accessToken };
    } catch (error) {
      removeRefreshToken();
      removeAccessToken();
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления токена';
      dispatch(updateTokenFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};

// Получение данных пользователя
export const getUser = (): AuthThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, AuthAction>, getState) => {
    dispatch(getUserRequest());

    try {
      let accessToken = getState().auth.accessToken;
      // Если токена нет в state, пытаемся получить из кук
      if (!accessToken) {
        accessToken = getAccessToken();
        if (accessToken) {
          // Обновляем state с токеном из кук
          dispatch({
            type: UPDATE_TOKEN_SUCCESS,
            payload: { accessToken, refreshToken: getRefreshToken() || '' },
          });
        }
      }

      if (!accessToken) {
        throw new Error('Токен не найден');
      }

      const response = await request<UserResponse>('/auth/user', {
        method: 'GET',
        headers: getAuthHeaders(accessToken),
      });

      const responseData = response as unknown as UserResponse;
      dispatch(getUserSuccess(responseData.user));
      return { success: true, user: responseData.user };
    } catch (error) {
      // Проверяем, истек ли токен (может быть в message или в response)
      const errorMessage = error instanceof Error ? (error.message || '') : '';
      const errorResponse = (error as any).response;
      const responseMessage = errorResponse?.message || '';
      const isTokenExpired = 
        errorMessage.includes('jwt expired') || 
        errorMessage.includes('401') ||
        responseMessage.includes('jwt expired') ||
        errorMessage.includes('Ошибка 401');
      
      // Если токен истек и есть refreshToken, пытаемся обновить
      if (isTokenExpired && getRefreshToken()) {
        try {
          const tokenResult = await dispatch(updateToken());
          if (tokenResult.success) {
            // Повторяем запрос с новым токеном
            const { accessToken: newAccessToken } = getState().auth;
            if (newAccessToken) {
            const retryResponse = await request<UserResponse>('/auth/user', {
              method: 'GET',
              headers: getAuthHeaders(newAccessToken),
            });
            const retryData = retryResponse as unknown as UserResponse;
            dispatch(getUserSuccess(retryData.user));
            return { success: true, user: retryData.user };
            }
          }
        } catch (tokenError) {
          // Если не удалось обновить токен, очищаем состояние
          removeRefreshToken();
          removeAccessToken();
          dispatch(getUserFailure(null)); // Не показываем ошибку, просто очищаем состояние
          return { success: false, error: null };
        }
      }
      
      // Если это не ошибка истечения токена или обновление не удалось, просто возвращаем ошибку
      // Но не показываем ошибку, если пользователь не авторизован (это нормально)
      if (errorMessage.includes('Токен не найден')) {
        // Это нормально, если пользователь не авторизован
        dispatch(getUserFailure(null));
        return { success: false, error: null };
      }
      
      // Для других ошибок тоже не показываем ошибку при инициализации
      // (пользователь может быть не авторизован)
      dispatch(getUserFailure(null));
      return { success: false, error: null };
    }
  };
};

// Обновление данных пользователя
export const updateUser = (name?: string, email?: string, password?: string): AuthThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, AuthAction>, getState) => {
    dispatch(updateUserRequest());

    try {
      let accessToken = getState().auth.accessToken;
      // Если токена нет в state, пытаемся получить из кук
      if (!accessToken) {
        accessToken = getAccessToken();
        if (accessToken) {
          // Обновляем state с токеном из кук
          dispatch({
            type: UPDATE_TOKEN_SUCCESS,
            payload: { accessToken, refreshToken: getRefreshToken() || '' },
          });
        }
      }

      if (!accessToken) {
        throw new Error('Токен не найден');
      }

      const body: { name?: string; email?: string; password?: string } = {};
      if (name) body.name = name;
      if (email) body.email = email;
      if (password) body.password = password;

      const response = await request<UserResponse>('/auth/user', {
        method: 'PATCH',
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify(body),
      });

      const responseData = response as unknown as UserResponse;
      dispatch(updateUserSuccess(responseData.user));
      return { success: true, user: responseData.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      // Если токен истек, пытаемся обновить
      if (errorMessage.includes('jwt expired') || errorMessage.includes('401')) {
        const tokenResult = await dispatch(updateToken());
        if (tokenResult.success) {
          // Повторяем запрос с новым токеном
          const { accessToken: newAccessToken } = getState().auth;
          const body: { name?: string; email?: string; password?: string } = {};
          if (name) body.name = name;
          if (email) body.email = email;
          if (password) body.password = password;

          const retryResponse = await request<UserResponse>('/auth/user', {
            method: 'PATCH',
            headers: getAuthHeaders(newAccessToken),
            body: JSON.stringify(body),
          });
          const retryData = retryResponse as unknown as UserResponse;
          dispatch(updateUserSuccess(retryData.user));
          return { success: true, user: retryData.user };
        }
      }
      const finalErrorMessage = errorMessage || 'Ошибка обновления данных пользователя';
      dispatch(updateUserFailure(finalErrorMessage));
      return { success: false, error: finalErrorMessage };
    }
  };
};

// Инициализация авторизации из кук
export const initAuth = (): ThunkAction<void, RootState, unknown, AuthAction> => {
  return (dispatch: ThunkDispatch<RootState, unknown, AuthAction>) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken && refreshToken) {
      dispatch({
        type: INIT_AUTH,
        payload: { accessToken, refreshToken },
      });
      // Пытаемся получить данные пользователя
      dispatch(getUser());
    }
  };
};

// Экспорт вспомогательных функций для использования в других модулях
export { getRefreshToken, getAccessToken, getAuthHeaders };
