import React from 'react';
import PropTypes from 'prop-types';
import { IngredientType } from '../../utils/types';
import Modal from '../Modal/Modal';
import styles from './IngredientDetails.module.css';

const IngredientDetails = ({ ingredient, onClose }) => {
  if (!ingredient) {
    return null;
  }

  const {
    name,
    image_large,
    calories,
    proteins,
    fat,
    carbohydrates,
  } = ingredient;

  return (
    <Modal title="Детали ингредиента" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <img
            src={image_large || ingredient.image}
            alt={name}
            className={styles.image}
          />
        </div>
        <h3 className="text text_type_main-medium mb-8">{name}</h3>
        <div className={styles.description}>
          <p className="text text_type_main-default text_color_inactive mb-15">
            Состав ингредиента
          </p>
        </div>
        <div className={styles.nutrition}>
          <div className={styles.nutritionItem}>
            <span className="text text_type_main-default text_color_inactive mb-2">
              Калории,ккал
            </span>
            <span className="text text_type_digits-default">{calories}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className="text text_type_main-default text_color_inactive mb-2">
              Белки, г
            </span>
            <span className="text text_type_digits-default">{proteins}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className="text text_type_main-default text_color_inactive mb-2">
              Жиры, г
            </span>
            <span className="text text_type_digits-default">{fat}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className="text text_type_main-default text_color_inactive mb-2">
              Углеводы, г
            </span>
            <span className="text text_type_digits-default">{carbohydrates}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

IngredientDetails.propTypes = {
  ingredient: IngredientType,
  onClose: PropTypes.func.isRequired,
};

IngredientDetails.defaultProps = {
  ingredient: null,
};

export default IngredientDetails;

