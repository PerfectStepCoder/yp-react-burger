import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import Modal from '../../components/Modal/Modal';
import { setCurrentIngredient } from '../../services/actions/currentIngredientActions';
import {
  createOrder,
  resetOrder,
} from '../../services/actions/orderActions';
import {
  resetConstructor,
} from '../../services/actions/burgerConstructorActions';
import { resetIngredientCounts } from '../../services/actions/ingredientsActions';
import styles from './Home.module.css';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.ingredients);
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const fillings = useSelector((state) => state.burgerConstructor.fillings);
  const order = useSelector((state) => state.order.order);
  const isOrderLoading = useSelector((state) => state.order.isLoading);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleIngredientClick = (ingredient) => {
    // Устанавливаем ингредиент в Redux и меняем URL
    dispatch(setCurrentIngredient(ingredient));
    // Меняем URL через navigate с replace: true, сохраняя информацию о текущей странице
    navigate(`/ingredients/${ingredient._id}`, { 
      replace: true, 
      state: { from: location.pathname } 
    });
  };

  const handleOrderClick = () => {
    if (!bun) {
      return;
    }

    // Проверяем авторизацию
    if (!isAuthenticated && !user) {
      // Редиректим на /login с сохранением текущего маршрута
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
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <BurgerIngredients onIngredientClick={handleIngredientClick} />
          </div>
          <div className={styles.rightColumn}>
            <BurgerConstructor onOrderClick={handleOrderClick} />
          </div>
        </div>
      </DndProvider>
    );
  };

  return (
    <>
      <main className={`${styles.main} pt-10 pb-10`}>{renderContent()}</main>
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

export default Home;