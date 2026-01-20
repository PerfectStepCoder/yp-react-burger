import { request } from '../../utils/request';
import { getAuthHeaders, getAccessToken } from './authActions';
import { Order, RootState } from '../../utils/types';
import {
  CreateOrderRequestAction,
  CreateOrderSuccessAction,
  CreateOrderFailureAction,
  ResetOrderAction,
  OrderAction,
} from '../../utils/types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const RESET_ORDER = 'RESET_ORDER';

const createOrderRequest = (): CreateOrderRequestAction => ({
  type: CREATE_ORDER_REQUEST,
});

const createOrderSuccess = (order: Order): CreateOrderSuccessAction => ({
  type: CREATE_ORDER_SUCCESS,
  payload: order,
});

const createOrderFailure = (error: string): CreateOrderFailureAction => ({
  type: CREATE_ORDER_FAILURE,
  payload: error,
});

export const resetOrder = (): ResetOrderAction => ({
  type: RESET_ORDER,
});

type OrderThunkAction = ThunkAction<Promise<void>, RootState, unknown, OrderAction>;

interface CreateOrderRequest {
  ingredients: string[];
}

interface OrderResponse {
  success: boolean;
  order?: Order;
  data?: Order;
}

export const createOrder = (ingredientIds: string[]): OrderThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, OrderAction>, getState) => {
    dispatch(createOrderRequest());

    try {
      // Получаем токен из state или из кук
      let accessToken = getState().auth.accessToken;
      if (!accessToken) {
        accessToken = getAccessToken();
      }

      if (!accessToken) {
        throw new Error('Токен не найден. Необходима авторизация.');
      }

      const response = await request<OrderResponse>('/orders', {
        method: 'POST',
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify({ ingredients: ingredientIds } as CreateOrderRequest),
      });

      const responseData = response as unknown as OrderResponse;
      const order = responseData.order || responseData.data;
      if (order) {
        dispatch(createOrderSuccess(order));
      } else {
        throw new Error('Данные заказа не получены');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания заказа';
      dispatch(createOrderFailure(errorMessage));
    }
  };
};
