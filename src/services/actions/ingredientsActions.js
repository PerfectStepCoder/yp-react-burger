import { API_BASE_URL } from '../../utils/api';
import fallbackIngredients from '../../utils/data';

export const FETCH_INGREDIENTS_REQUEST = 'FETCH_INGREDIENTS_REQUEST';
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS';
export const FETCH_INGREDIENTS_FAILURE = 'FETCH_INGREDIENTS_FAILURE';
export const INCREMENT_INGREDIENT_COUNT = 'INCREMENT_INGREDIENT_COUNT';
export const DECREMENT_INGREDIENT_COUNT = 'DECREMENT_INGREDIENT_COUNT';
export const RESET_INGREDIENT_COUNTS = 'RESET_INGREDIENT_COUNTS';

const fetchIngredientsRequest = () => ({
  type: FETCH_INGREDIENTS_REQUEST,
});

const fetchIngredientsSuccess = (items) => ({
  type: FETCH_INGREDIENTS_SUCCESS,
  payload: items,
});

const fetchIngredientsFailure = (error) => ({
  type: FETCH_INGREDIENTS_FAILURE,
  payload: error,
});

export const incrementIngredientCount = (id, amount = 1) => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: { id, amount },
});

export const decrementIngredientCount = (id, amount = 1) => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: { id, amount },
});

export const resetIngredientCounts = () => ({
  type: RESET_INGREDIENT_COUNTS,
});

export const fetchIngredients = () => async (dispatch) => {
  dispatch(fetchIngredientsRequest());

  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`);

    if (!response.ok) {
      throw new Error(`Не удалось загрузить ингредиенты: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('API вернуло неудачный ответ');
    }

    dispatch(fetchIngredientsSuccess(data.data));
  } catch (error) {
    if (fallbackIngredients && fallbackIngredients.length > 0) {
      console.warn('Не удалось загрузить ингредиенты с API, используем запасной набор', error);
      dispatch(fetchIngredientsSuccess(fallbackIngredients));
    } else {
      dispatch(fetchIngredientsFailure(error.message || 'Ошибка загрузки ингредиентов'));
    }
  }
};

