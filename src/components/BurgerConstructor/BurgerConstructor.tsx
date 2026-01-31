import React, { useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
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
import { Ingredient } from '../../utils/types';

interface BurgerConstructorProps {
  onOrderClick?: () => void;
}

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({ onOrderClick }) => {
  const dispatch = useDispatch();
  const bun = useSelector((state) => state.burgerConstructor.bun as Ingredient | null);
  const fillings = useSelector((state) => state.burgerConstructor.fillings as Array<Ingredient & { uuid: string }>);

  const totalPrice = useMemo(() => {
    const bunTotal = bun ? bun.price * 2 : 0;
    const fillingsTotal = fillings.reduce((sum, item) => sum + item.price, 0);
    return bunTotal + fillingsTotal;
  }, [bun, fillings]);

  const handleDrop = useCallback(
    (ingredient: Ingredient) => {
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
    (uuid: string, ingredientId: string) => {
      dispatch(removeIngredientFromConstructor(uuid));
      dispatch(decrementIngredientCount(ingredientId));
    },
    [dispatch],
  );

  const moveCard = useCallback(
    (fromIndex: number, toIndex: number) => {
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
      ref={dropRef as any}
      className={`${styles.wrapper} pt-25 pb-10 pl-10 pr-10`}
      data-testid="constructor-drop-zone"
    >
      <div className={String(styles.constructor)}>
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
        <div className={`${styles.total} mr-10`} data-testid="order-total">
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

export default BurgerConstructor;
