import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import Ingredient from '../Ingredient/Ingredient';

const TABS = [
  { value: 'bun', label: 'Булки' },
  { value: 'sauce', label: 'Соусы' },
  { value: 'main', label: 'Начинки' },
];

const BurgerIngredients = ({ ingredients, onIngredientClick }) => {
  const buns = useMemo(
    () => ingredients.filter((i) => i.type === 'bun'),
    [ingredients],
  );
  const sauces = useMemo(
    () => ingredients.filter((i) => i.type === 'sauce'),
    [ingredients],
  );
  const mains = useMemo(
    () => ingredients.filter((i) => i.type === 'main'),
    [ingredients],
  );

  return (
    <section className={`${styles.wrapper} pt-10 pb-10`}>
      <div className="text text_type_main-large mb-5">Соберите бургер</div>

      <div className={`${styles.tabs} mb-6`}>
        {TABS.map((tab, index) => (
          <Tab
            key={tab.value}
            value={tab.value}
            active={index === 0}
            onClick={() => {}}
          >
            {tab.label}
          </Tab>
        ))}
      </div>

      <div className={`${styles.scrollContainer} custom-scroll`}>
        <div className={styles.section} id="section-buns">
          <h2 className="text text_type_main-medium mb-6">Булки</h2>
          <ul className={`${styles.list} pr-4 mb-10`}>
            {buns.map((item) => (
              <li key={item._id}>
                <Ingredient ingredient={item} onClick={onIngredientClick} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section} id="section-sauces">
          <h2 className="text text_type_main-medium mb-6">Соусы</h2>
          <ul className={`${styles.list} pr-4 mb-10`}>
            {sauces.map((item) => (
              <li key={item._id}>
                <Ingredient ingredient={item} onClick={onIngredientClick} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section} id="section-mains">
          <h2 className="text text_type_main-medium mb-6">Начинки</h2>
          <ul className={`${styles.list} pr-4`}>
            {mains.map((item) => (
              <li key={item._id}>
                <Ingredient ingredient={item} onClick={onIngredientClick} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BurgerIngredients;

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      count: PropTypes.number,
    }),
  ),
  onIngredientClick: PropTypes.func,
};

BurgerIngredients.defaultProps = {
  ingredients: [],
  onIngredientClick: null,
};
