import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppHeader from '../../components/AppHeader/AppHeader';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import Modal from '../../components/Modal/Modal';
import { fetchIngredients } from '../../services/actions/ingredientsActions';
import {
  setCurrentIngredient,
  clearCurrentIngredient,
} from '../../services/actions/currentIngredientActions';
import {
  createOrder,
  resetOrder,
} from '../../services/actions/orderActions';
import {
  resetConstructor,
} from '../../services/actions/burgerConstructorActions';
import { resetIngredientCounts } from '../../services/actions/ingredientsActions';
import styles from './Home.module.css';

function App() {
  const dispatch = useDispatch();
  const { items: ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients,
  );
  const currentIngredient = useSelector(
    (state) => state.currentIngredient.item,
  );
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const fillings = useSelector((state) => state.burgerConstructor.fillings);
  const order = useSelector((state) => state.order.order);
  const isOrderLoading = useSelector((state) => state.order.isLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientClick = (ingredient) => {
    dispatch(setCurrentIngredient(ingredient));
  };

  const handleCloseIngredientModal = () => {
    dispatch(clearCurrentIngredient());
  };

  const handleOrderClick = () => {
    if (!bun) {
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
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={handleIngredientClick}
            />
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
      <AppHeader />
      <main className={`${styles.main} pt-10 pb-10`}>{renderContent()}</main>
      {currentIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
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

export default App;