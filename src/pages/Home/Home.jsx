import React, { useState } from 'react';
import AppHeader from '../../components/AppHeader/AppHeader';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import { useIngredients } from '../../hooks/useIngredients';
import { MOCK_ORDER_NUMBER } from '../../utils/mockData';
import styles from './Home.module.css';

function App() {
  const { ingredients, loading, error } = useIngredients();
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleCloseIngredientModal = () => {
    setSelectedIngredient(null);
  };

  const handleOrderClick = () => {
    // Временная заглушка для номера заказа
    // В будущем здесь будет реальный запрос к API
    // Используем тестовые данные из mockData.js
    setOrderNumber(MOCK_ORDER_NUMBER);
  };

  const handleCloseOrderModal = () => {
    setOrderNumber(null);
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className={`${styles.main} pt-10 pb-10`}>
          <div className="text text_type_main-large">
            Загрузка ингредиентов...
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader />
        <main className={`${styles.main} pt-10 pb-10`}>
          <div className="text text_type_main-large text_color_error">
            Ошибка загрузки: {error}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className={`${styles.main} pt-10 pb-10`}>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={handleIngredientClick}
            />
          </div>
          <div className={styles.rightColumn}>
            <BurgerConstructor
              ingredients={ingredients}
              onOrderClick={handleOrderClick}
            />
          </div>
        </div>
      </main>
      {selectedIngredient && (
        <IngredientDetails
          ingredient={selectedIngredient}
          onClose={handleCloseIngredientModal}
        />
      )}
      {orderNumber !== null && (
        <OrderDetails orderNumber={orderNumber} onClose={handleCloseOrderModal} />
      )}
    </>
  );
}

export default App;