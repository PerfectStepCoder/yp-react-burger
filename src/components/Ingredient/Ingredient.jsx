import React from 'react';
import PropTypes from 'prop-types';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Ingredient.module.css';

const Ingredient = ({ ingredient }) => {
  const { name, price, image, count } = ingredient;

  return (
    <article className={`${styles.card} pt-6 pb-6 pl-6 pr-6`}>
      {!!count && (
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
  ingredient: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    count: PropTypes.number,
  }).isRequired,
};

export default Ingredient;


