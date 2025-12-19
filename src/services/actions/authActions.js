import { request } from '../../utils/request';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookies';

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

const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

const registerSuccess = (user, accessToken, refreshToken) => ({
  type: REGISTER_SUCCESS,
  payload: { user, accessToken, refreshToken },
});

const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

const loginSuccess = (user, accessToken, refreshToken) => ({
  type: LOGIN_SUCCESS,
  payload: { user, accessToken, refreshToken },
});

const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

// eslint-disable-next-line no-unused-vars
const logoutFailure = (error) => ({
  type: LOGOUT_FAILURE,
  payload: error,
});

const updateTokenRequest = () => ({
  type: UPDATE_TOKEN_REQUEST,
});

const updateTokenSuccess = (accessToken, refreshToken) => ({
  type: UPDATE_TOKEN_SUCCESS,
  payload: { accessToken, refreshToken },
});

const updateTokenFailure = (error) => ({
  type: UPDATE_TOKEN_FAILURE,
  payload: error,
});

const getUserRequest = () => ({
  type: GET_USER_REQUEST,
});

const getUserSuccess = (user) => ({
  type: GET_USER_SUCCESS,
  payload: user,
});

const getUserFailure = (error) => ({
  type: GET_USER_FAILURE,
  payload: error,
});

const updateUserRequest = () => ({
  type: UPDATE_USER_REQUEST,
});

const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user,
});

const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

// Сохранение refreshToken в куки
const saveRefreshToken = (token) => {
  setCookie('refreshToken', token, 7); // Храним 7 дней
};

// Сохранение accessToken в куки
const saveAccessToken = (token) => {
  setCookie('accessToken', token, 1); // Храним 1 день (токен живет 20 минут, но на всякий случай)
};

// Удаление refreshToken из кук
const removeRefreshToken = () => {
  deleteCookie('refreshToken');
};

// Удаление accessToken из кук
const removeAccessToken = () => {
  deleteCookie('accessToken');
};

// Получение refreshToken из кук
const getRefreshToken = () => {
  return getCookie('refreshToken');
};

// Получение accessToken из кук
const getAccessToken = () => {
  return getCookie('accessToken');
};

// Функция для создания заголовков с токеном
const getAuthHeaders = (accessToken) => {
  return {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: accessToken }),
  };
};

// Регистрация
export const register = (email, password, name) => async (dispatch) => {
  dispatch(registerRequest());

  try {
    const data = await request('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const { user, accessToken, refreshToken } = data;
    saveRefreshToken(refreshToken);
    saveAccessToken(accessToken);
    dispatch(registerSuccess(user, accessToken, refreshToken));
    return { success: true };
  } catch (error) {
    dispatch(registerFailure(error.message || 'Ошибка регистрации'));
    return { success: false, error: error.message || 'Ошибка регистрации' };
  }
};

// Авторизация
export const login = (email, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const data = await request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const { user, accessToken, refreshToken } = data;
    saveRefreshToken(refreshToken);
    saveAccessToken(accessToken);
    dispatch(loginSuccess(user, accessToken, refreshToken));
    return { success: true };
  } catch (error) {
    dispatch(loginFailure(error.message || 'Ошибка авторизации'));
    return { success: false, error: error.message || 'Ошибка авторизации' };
  }
};

// Выход из системы
export const logout = () => async (dispatch, getState) => {
  dispatch(logoutRequest());

  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const data = await request('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });
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

// Обновление токена
export const updateToken = () => async (dispatch) => {
  dispatch(updateTokenRequest());

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token не найден');
    }

    const data = await request('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    const { accessToken, refreshToken: newRefreshToken } = data;
    saveRefreshToken(newRefreshToken);
    saveAccessToken(accessToken);
    dispatch(updateTokenSuccess(accessToken, newRefreshToken));
    return { success: true, accessToken };
  } catch (error) {
    removeRefreshToken();
    removeAccessToken();
    dispatch(updateTokenFailure(error.message || 'Ошибка обновления токена'));
    return { success: false, error: error.message || 'Ошибка обновления токена' };
  }
};

// Получение данных пользователя
export const getUser = () => async (dispatch, getState) => {
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
          payload: { accessToken, refreshToken: getRefreshToken() },
        });
      }
    }

    if (!accessToken) {
      throw new Error('Токен не найден');
    }

    const data = await request('/auth/user', {
      method: 'GET',
      headers: getAuthHeaders(accessToken),
    });

    dispatch(getUserSuccess(data.user));
    return { success: true, user: data.user };
  } catch (error) {
    // Проверяем, истек ли токен (может быть в message или в response)
    const errorMessage = error.message || '';
    const responseMessage = error.response?.message || '';
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
            const retryData = await request('/auth/user', {
              method: 'GET',
              headers: getAuthHeaders(newAccessToken),
            });
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

// Обновление данных пользователя
export const updateUser = (name, email, password) => async (dispatch, getState) => {
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
          payload: { accessToken, refreshToken: getRefreshToken() },
        });
      }
    }

    if (!accessToken) {
      throw new Error('Токен не найден');
    }

    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;

    const data = await request('/auth/user', {
      method: 'PATCH',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify(body),
    });

    dispatch(updateUserSuccess(data.user));
    return { success: true, user: data.user };
  } catch (error) {
    // Если токен истек, пытаемся обновить
    if (error.message.includes('jwt expired') || error.message.includes('401')) {
      const tokenResult = await dispatch(updateToken());
      if (tokenResult.success) {
        // Повторяем запрос с новым токеном
        const { accessToken: newAccessToken } = getState().auth;
        const body = {};
        if (name) body.name = name;
        if (email) body.email = email;
        if (password) body.password = password;

        const retryData = await request('/auth/user', {
          method: 'PATCH',
          headers: getAuthHeaders(newAccessToken),
          body: JSON.stringify(body),
        });
        dispatch(updateUserSuccess(retryData.user));
        return { success: true, user: retryData.user };
      }
    }
    dispatch(updateUserFailure(error.message || 'Ошибка обновления данных пользователя'));
    return { success: false, error: error.message || 'Ошибка обновления данных пользователя' };
  }
};

// Инициализация авторизации из кук
export const initAuth = () => (dispatch) => {
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

// Экспорт вспомогательных функций для использования в других модулях
export { getRefreshToken, getAccessToken, getAuthHeaders };

