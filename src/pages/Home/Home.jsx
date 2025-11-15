import React from 'react';
import AppHeader from '../../components/AppHeader/AppHeader';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';
import ingredients from '../../utils/data';
import styles from './Home.module.css';

function App() {
  return (
    <>
      <AppHeader />
      <main className={`${styles.main} pt-10 pb-10`}>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <BurgerIngredients ingredients={ingredients} />
          </div>
          <div className={styles.rightColumn}>
            <BurgerConstructor />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;