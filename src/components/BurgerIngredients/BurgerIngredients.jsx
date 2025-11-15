import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Counter,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';

const TABS = [
  { value: 'bun', label: 'Булки' },
  { value: 'sauce', label: 'Соусы' },
  { value: 'main', label: 'Начинки' },
];

const BurgerIngredients = ({ ingredients }) => {
  const defaultTab = useMemo(() => {
    if (ingredients.some((item) => item.type === 'bun')) {
      return 'bun';
    }
    if (ingredients.some((item) => item.type === 'sauce')) {
      return 'sauce';
    }
    if (ingredients.some((item) => item.type === 'main')) {
      return 'main';
    }
    return 'bun';
  }, [ingredients]);

  const [currentTab, setCurrentTab] = useState(defaultTab);

  useEffect(() => {
    setCurrentTab((prevTab) =>
      ingredients.some((item) => item.type === prevTab)
        ? prevTab
        : defaultTab,
    );
  }, [ingredients, defaultTab]);

  const filteredIngredients = useMemo(
    () => ingredients.filter((item) => item.type === currentTab),
    [ingredients, currentTab],
  );

  return (
    <section className={`${styles.wrapper} pt-10 pb-10`}>
      <div className="text text_type_main-large mb-5">Соберите бургер</div>

      <div className={`${styles.tabs} mb-6`}>
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            active={currentTab === tab.value}
            onClick={setCurrentTab}
          >
            {tab.label}
          </Tab>
        ))}
      </div>

      <div className={`${styles.scrollContainer} custom-scroll`}>
        {filteredIngredients.length > 0 ? (
          <ul className={`${styles.list} pr-4`}>
            {filteredIngredients.map((item) => (
              <li key={item._id}>
                <article className={`${styles.card} pt-6 pb-6 pl-6 pr-6`}>
                  {!!item.count && (
                    <div className={styles.counter}>
                      <Counter count={item.count} size="default" />
                    </div>
                  )}

                  <div className={`${styles.imageWrapper} mb-4`}>
                    <img
                      className={styles.image}
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className={`${styles.price} mb-2`}>
                    <span className="text text_type_digits-default mr-2">
                      {item.price}
                    </span>
                    <CurrencyIcon type="primary" />
                  </div>

                  <p
                    className={`text text_type_main-default text_color_primary ${styles.textCenter}`}
                  >
                    {item.name}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className={`${styles.empty} pt-10 pb-10`}>
            <p className="text text_type_main-default text_color_inactive text_center">
              Нет ингредиентов в этой категории
            </p>
          </div>
        )}
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
};

BurgerIngredients.defaultProps = {
  ingredients: [],
};
