import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';

const BurgerConstructor = ({ ingredients = [], onOrderClick }) => {
  const buns = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients],
  );
  const fillings = useMemo(
    () => ingredients.filter((item) => item.type !== 'bun'),
    [ingredients],
  );

  const topBun = buns[0];
  const bottomBun = topBun;

  const totalPrice = useMemo(() => {
    const bunTotal =
      (topBun?.price ?? 0) + (bottomBun?.price ?? 0);
    const fillingsTotal = fillings.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    return bunTotal + fillingsTotal;
  }, [topBun, bottomBun, fillings]);

  if (!topBun) {
    return null;
  }

  return (
    <section className={`${styles.wrapper} pt-25 pb-10 pl-10 pr-10`}>
      <div className={styles.constructor}>
        <div className="mb-4">
          <ConstructorElement
            type="top"
            isLocked
            text={`${topBun.name} (верх)`}
            price={topBun.price}
            thumbnail={topBun.image}
          />
        </div>

        <ul className={`${styles.fillings} custom-scroll mb-4`}>
          {fillings.map((item) => (
            <li className={`${styles.item} pb-4`} key={item._id}>
              <div className={styles.dragIcon}>
                <DragIcon type="primary" />
              </div>
              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
              />
            </li>
          ))}
        </ul>

        {bottomBun && (
          <div className="mb-4">
            <ConstructorElement
              type="bottom"
              isLocked
              text={`${bottomBun.name} (низ)`}
              price={bottomBun.price}
              thumbnail={bottomBun.image}
            />
          </div>
        )}
      </div>

      <div className={styles.summary}>
        <div className={`${styles.total} mr-10`}>
          <span className="text text_type_digits-medium mr-2">
            {totalPrice}
          </span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={onOrderClick}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ),
  onOrderClick: PropTypes.func,
};

BurgerConstructor.defaultProps = {
  ingredients: [],
  onOrderClick: null,
};

export default BurgerConstructor;

