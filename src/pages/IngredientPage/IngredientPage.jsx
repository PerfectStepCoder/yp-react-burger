import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/actions/currentIngredientActions';
import styles from './IngredientPage.module.css';

const IngredientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredient = ingredients.find((item) => item._id === id);

  useEffect(() => {
    // Всегда устанавливаем currentIngredient для модального окна, если ингредиент найден
    if (ingredient) {
      // Сохраняем информацию о предыдущей странице для возврата при закрытии
      if (location.state?.from) {
        sessionStorage.setItem('ingredientFrom', location.state.from);
      } else if (!sessionStorage.getItem('ingredientFrom')) {
        // Если нет информации о предыдущей странице (прямой переход), сохраняем главную как fallback
        sessionStorage.setItem('ingredientFrom', '/');
      }
      // Устанавливаем currentIngredient для модального окна (работает и при клике, и при прямом переходе)
      dispatch(setCurrentIngredient(ingredient));
    }
  }, [location.state, ingredient, dispatch]);

  useEffect(() => {
    // Очищаем currentIngredient и sessionStorage при уходе со страницы
    return () => {
      if (location.pathname !== `/ingredients/${id}`) {
        dispatch(clearCurrentIngredient());
        sessionStorage.removeItem('ingredientFrom');
      }
    };
  }, [location.pathname, id, dispatch]);

  if (!ingredient) {
    return (
      <div className={styles.container}>
        <h1 className="text text_type_main-large mb-6">Ингредиент не найден</h1>
        <button
          onClick={() => navigate(-1)}
          className="text text_type_main-default text_color_accent"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  // Модальное окно покажется автоматически через IngredientModal в App.jsx
  // Здесь просто возвращаем null, чтобы не показывать дублирующий контент
  return null;
};

export default IngredientPage;

