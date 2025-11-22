import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { IngredientType } from '../../utils/types';
import styles from './Ingredient.module.css';

const Ingredient = ({ ingredient, onClick }) => {
  const { name, price, image, count } = ingredient;

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [ingredient]);

  return (
    <article
      ref={dragRef}
      className={`${styles.card} pt-6 pb-6 pl-6 pr-6`}
      onClick={() => onClick && onClick(ingredient)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(ingredient);
        }
      }}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" />
        </div>
      )}

      <div className={`${styles.imageWrapper} mb-4`}>
        <img className={styles.image} src={image} alt={name} />
      </div>

      <div className={`${styles.price} mb-2`}>
        <span className="text text_type_digits-default mr-2">{price}</span>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`text text_type_main-default text_color_primary ${styles.textCenter}`}>
        {name}
      </p>
    </article>
  );
};

Ingredient.propTypes = {
  ingredient: IngredientType.isRequired,
  onClick: PropTypes.func,
};

export default Ingredient;

