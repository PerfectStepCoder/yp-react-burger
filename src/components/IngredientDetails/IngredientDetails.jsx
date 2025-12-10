import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './IngredientDetails.module.css';

const IngredientDetails = () => {
  const { id } = useParams();
  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredient = ingredients.find((item) => item._id === id);

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
  );
};

export default IngredientDetails;

