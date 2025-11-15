import React, { useMemo } from 'react';
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import ingredientsData from '../../utils/data';
import styles from './BurgerConstructor.module.css';

const BurgerConstructor = () => {
  const buns = useMemo(
    () => ingredientsData.filter((item) => item.type === 'bun'),
    [],
  );
  const fillings = useMemo(
    () => ingredientsData.filter((item) => item.type !== 'bun'),
    [],
  );

  const topBun = buns[0];
  const bottomBun = buns[1] || buns[0];

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
              <DragIcon type="primary" />
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
        <Button htmlType="button" type="primary" size="large">
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
