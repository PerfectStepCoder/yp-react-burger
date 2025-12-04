import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import Modal from '../../components/Modal/Modal';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/actions/currentIngredientActions';
import styles from './IngredientPage.module.css';

const IngredientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredient = ingredients.find((item) => item._id === id);

  React.useEffect(() => {
    // Если пришли с главной страницы (есть fromHome в state) или это обновление страницы
    // (нет fromHome, но мы на маршруте ингредиента), показываем модальное окно
    if (ingredient) {
      // Сохраняем информацию о том, что это переход с главной страницы
      if (location.state?.fromHome) {
        sessionStorage.setItem('ingredientFromHome', 'true');
        dispatch(setCurrentIngredient(ingredient));
      } else if (sessionStorage.getItem('ingredientFromHome') === 'true') {
        // При обновлении страницы восстанавливаем модальное окно
        dispatch(setCurrentIngredient(ingredient));
      }
    }
  }, [location.state, ingredient, dispatch]);

  React.useEffect(() => {
    // Очищаем sessionStorage при размонтировании компонента
    return () => {
      if (location.pathname !== '/ingredients/' + id) {
        sessionStorage.removeItem('ingredientFromHome');
      }
    };
  }, [location.pathname, id]);

  const handleClose = () => {
    const isFromHome = location.state?.fromHome || sessionStorage.getItem('ingredientFromHome') === 'true';
    if (isFromHome) {
      // Если пришли с главной страницы, возвращаемся туда
      sessionStorage.removeItem('ingredientFromHome');
      dispatch(clearCurrentIngredient());
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  if (!ingredient) {
    return (
      <div className={styles.container}>
        <h1 className="text text_type_main-large mb-6">Ингредиент не найден</h1>
        <button
          onClick={handleClose}
          className="text text_type_main-default text_color_accent"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  // Проверяем, нужно ли показывать модальное окно
  const isFromHome = location.state?.fromHome || sessionStorage.getItem('ingredientFromHome') === 'true';

  // Если это прямой переход (нет fromHome в state и нет информации в sessionStorage), показываем отдельную страницу
  if (!isFromHome) {
    return (
      <div className={styles.container}>
        <IngredientDetails ingredient={ingredient} />
      </div>
    );
  }

  // Если пришли с главной страницы или обновили страницу с модальным окном, показываем модальное окно
  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};

export default IngredientPage;

