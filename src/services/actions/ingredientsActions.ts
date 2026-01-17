import { request } from '../../utils/request';
import fallbackIngredients from '../../utils/data';
import { Ingredient, RootState } from '../../utils/types';
import {
  FetchIngredientsRequestAction,
  FetchIngredientsSuccessAction,
  FetchIngredientsFailureAction,
  IncrementIngredientCountAction,
  DecrementIngredientCountAction,
  ResetIngredientCountsAction,
  IngredientsAction,
} from '../../utils/types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const FETCH_INGREDIENTS_REQUEST = 'FETCH_INGREDIENTS_REQUEST';
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS';
export const FETCH_INGREDIENTS_FAILURE = 'FETCH_INGREDIENTS_FAILURE';
export const INCREMENT_INGREDIENT_COUNT = 'INCREMENT_INGREDIENT_COUNT';
export const DECREMENT_INGREDIENT_COUNT = 'DECREMENT_INGREDIENT_COUNT';
export const RESET_INGREDIENT_COUNTS = 'RESET_INGREDIENT_COUNTS';

const fetchIngredientsRequest = (): FetchIngredientsRequestAction => ({
  type: FETCH_INGREDIENTS_REQUEST,
});

const fetchIngredientsSuccess = (items: Ingredient[]): FetchIngredientsSuccessAction => ({
  type: FETCH_INGREDIENTS_SUCCESS,
  payload: items,
});

const fetchIngredientsFailure = (error: string): FetchIngredientsFailureAction => ({
  type: FETCH_INGREDIENTS_FAILURE,
  payload: error,
});

export const incrementIngredientCount = (id: string, amount: number = 1): IncrementIngredientCountAction => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: { id, amount },
});

export const decrementIngredientCount = (id: string, amount: number = 1): DecrementIngredientCountAction => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: { id, amount },
});

export const resetIngredientCounts = (): ResetIngredientCountsAction => ({
  type: RESET_INGREDIENT_COUNTS,
});

type IngredientsThunkAction = ThunkAction<Promise<void>, RootState, unknown, IngredientsAction>;

interface IngredientsResponse {
  data: Ingredient[];
}

export const fetchIngredients = (): IngredientsThunkAction => {
  return async (dispatch: ThunkDispatch<RootState, unknown, IngredientsAction>) => {
    dispatch(fetchIngredientsRequest());

    try {
      const response = await request<IngredientsResponse>('/ingredients');
      const responseData = response as unknown as IngredientsResponse;
      if (responseData.data) {
        dispatch(fetchIngredientsSuccess(responseData.data));
      } else {
        throw new Error('Данные ингредиентов не получены');
      }
    } catch (error) {
      if (fallbackIngredients && fallbackIngredients.length > 0) {
        console.warn('Не удалось загрузить ингредиенты с API, используем запасной набор', error);
        dispatch(fetchIngredientsSuccess(fallbackIngredients as Ingredient[]));
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки ингредиентов';
        dispatch(fetchIngredientsFailure(errorMessage));
      }
    }
  };
};
