import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  setConstructorBun,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientInConstructor,
} from '../../services/actions/burgerConstructorActions';
import {
  incrementIngredientCount,
  decrementIngredientCount,
} from '../../services/actions/ingredientsActions';
import styles from './BurgerConstructor.module.css';
import ConstructorFilling from './ConstructorFilling';

const BurgerConstructor = ({ onOrderClick }) => {
  const dispatch = useDispatch();
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const fillings = useSelector((state) => state.burgerConstructor.fillings);

  const totalPrice = useMemo(() => {
    const bunTotal = bun ? bun.price * 2 : 0;
    const fillingsTotal = fillings.reduce((sum, item) => sum + item.price, 0);
    return bunTotal + fillingsTotal;
  }, [bun, fillings]);

  const handleDrop = useCallback(
    (ingredient) => {
      if (ingredient.type === 'bun') {
        if (bun && bun._id === ingredient._id) {
          return;
        }
        if (bun) {
          dispatch(decrementIngredientCount(bun._id, 2));
        }
        dispatch(setConstructorBun(ingredient));
        dispatch(incrementIngredientCount(ingredient._id, 2));
      } else {
        dispatch(addIngredientToConstructor(ingredient));
        dispatch(incrementIngredientCount(ingredient._id));
      }
    },
    [bun, dispatch],
  );

  const handleRemoveIngredient = useCallback(
    (uuid, ingredientId) => {
      dispatch(removeIngredientFromConstructor(uuid));
      dispatch(decrementIngredientCount(ingredientId));
    },
    [dispatch],
  );

  const moveCard = useCallback(
    (fromIndex, toIndex) => {
      dispatch(moveIngredientInConstructor(fromIndex, toIndex));
    },
    [dispatch],
  );

  const [, dropRef] = useDrop({
    accept: 'ingredient',
    drop: handleDrop,
  });

  const isOrderDisabled = !bun || fillings.length === 0;

  return (
    <section
      ref={dropRef}
      className={`${styles.wrapper} pt-25 pb-10 pl-10 pr-10`}
    >
      <div className={styles.constructor}>
        <div className={`${styles.bunWrapper} mb-4`}>
          {bun ? (
            <ConstructorElement
              type="top"
              isLocked
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            <div className={`${styles.placeholder} text text_type_main-default`}>
              Перетащите булку сюда
            </div>
          )}
        </div>

        {fillings.length > 0 ? (
          <ul className={`${styles.fillings} custom-scroll mb-4`}>
            {fillings.map((item, index) => (
              <ConstructorFilling
                key={item.uuid}
                index={index}
                item={item}
                moveCard={moveCard}
                onRemove={handleRemoveIngredient}
              />
            ))}
          </ul>
        ) : (
          <div
            className={`${styles.placeholder} text text_type_main-default text_color_inactive mb-4`}
          >
            Перетащите ингредиенты сюда
          </div>
        )}

        <div className={`${styles.bunWrapper} mb-4`}>
          {bun ? (
            <ConstructorElement
              type="bottom"
              isLocked
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            <div className={`${styles.placeholder} text text_type_main-default`}>
              Перетащите булку сюда
            </div>
          )}
        </div>
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
          disabled={isOrderDisabled}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  onOrderClick: PropTypes.func,
};

BurgerConstructor.defaultProps = {
  onOrderClick: null,
};

export default BurgerConstructor;

