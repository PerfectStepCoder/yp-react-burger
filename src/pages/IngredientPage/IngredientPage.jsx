import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/actions/currentIngredientActions';
import { createOrder, resetOrder } from '../../services/actions/orderActions';
import { resetConstructor } from '../../services/actions/burgerConstructorActions';
import { resetIngredientCounts } from '../../services/actions/ingredientsActions';
import Modal from '../../components/Modal/Modal';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import styles from './IngredientPage.module.css';
import homeStyles from '../Home/Home.module.css';

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
      // Сохраняем информацию о предыдущей странице для возврата при закрытии модального окна
      if (location.state?.from) {
        // Если пришли с другой страницы (клик по ингредиенту)
        sessionStorage.setItem('ingredientFrom', location.state.from);
      } else {
        // При прямом переходе по ссылке возвращаемся на главную страницу
        sessionStorage.setItem('ingredientFrom', '/');
      }
      // Устанавливаем currentIngredient для модального окна (и при клике, и при прямом переходе)
      dispatch(setCurrentIngredient(ingredient));
    }
  }, [location.state, ingredient, dispatch]);

  const currentIngredient = useSelector((state) => state.currentIngredient.item);
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const fillings = useSelector((state) => state.burgerConstructor.fillings);
  const order = useSelector((state) => state.order.order);
  const isOrderLoading = useSelector((state) => state.order.isLoading);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.ingredients);

  const handleIngredientClick = (ingredient) => {
    dispatch(setCurrentIngredient(ingredient));
    navigate(`/ingredients/${ingredient._id}`, { 
      replace: true, 
      state: { from: location.pathname } 
    });
  };

  const handleOrderClick = () => {
    if (!bun) {
      return;
    }

    if (!isAuthenticated && !user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...fillings.map((item) => item._id),
      bun._id,
    ];

    dispatch(createOrder(ingredientIds));
  };

  const handleCloseOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetConstructor());
    dispatch(resetIngredientCounts());
  };

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

  // Если есть currentIngredient, показываем главную страницу (конструктор бургера) в фоне
  // Модальное окно покажется автоматически через IngredientModal в App.jsx
  if (currentIngredient) {
    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="text text_type_main-large">Загрузка ингредиентов...</div>
        );
      }

      if (error) {
        return (
          <div className="text text_type_main-large text_color_error">
            Ошибка загрузки: {error}
          </div>
        );
      }

      return (
        <DndProvider backend={HTML5Backend}>
          <div className={homeStyles.columns}>
            <div className={homeStyles.leftColumn}>
              <BurgerIngredients onIngredientClick={handleIngredientClick} />
            </div>
            <div className={homeStyles.rightColumn}>
              <BurgerConstructor onOrderClick={handleOrderClick} />
            </div>
          </div>
        </DndProvider>
      );
    };

    return (
      <>
        <main className={`${homeStyles.main} pt-10 pb-10`}>{renderContent()}</main>
        {order && (
          <Modal title="" onClose={handleCloseOrderModal}>
            <OrderDetails orderNumber={order.number} />
            {isOrderLoading && (
              <p className="text text_type_main-default text_color_inactive mt-4">
                Оформляем заказ...
              </p>
            )}
          </Modal>
        )}
      </>
    );
  }

  // Если нет currentIngredient, показываем отдельную страницу с деталями ингредиента
  return (
    <div className={styles.container}>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
};

export default IngredientPage;

