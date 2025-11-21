import { API_BASE_URL } from '../../utils/api';

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const RESET_ORDER = 'RESET_ORDER';

const createOrderRequest = () => ({
  type: CREATE_ORDER_REQUEST,
});

const createOrderSuccess = (order) => ({
  type: CREATE_ORDER_SUCCESS,
  payload: order,
});

const createOrderFailure = (error) => ({
  type: CREATE_ORDER_FAILURE,
  payload: error,
});

export const resetOrder = () => ({
  type: RESET_ORDER,
});

export const createOrder = (ingredientIds) => async (dispatch) => {
  dispatch(createOrderRequest());

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });

    if (!response.ok) {
      throw new Error(`Не удалось создать заказ: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('API вернуло неудачный ответ при создании заказа');
    }

    dispatch(createOrderSuccess(data.order));
  } catch (error) {
    dispatch(createOrderFailure(error.message || 'Ошибка создания заказа'));
  }
};

