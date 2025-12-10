import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { IngredientType } from '../../utils/types';
import styles from './Ingredient.module.css';

const Ingredient = ({ ingredient }) => {
  const { name, price, image, count, _id } = ingredient;
  const location = useLocation();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [ingredient]);

  const handleClick = (e) => {
    // Предотвращаем переход при перетаскивании
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Если это не перетаскивание, разрешаем переход
  };

  return (
    <Link
      to={`/ingredients/${_id}`}
      state={{ background: location }}
      className={styles.link}
      onClick={handleClick}
    >
      <article
        ref={dragRef}
        className={`${styles.card} pt-6 pb-6 pl-6 pr-6`}
        style={{
          cursor: 'pointer',
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
    </Link>
  );
};

Ingredient.propTypes = {
  ingredient: IngredientType.isRequired,
};

export default Ingredient;

