import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import styles from './IngredientPage.module.css';

const IngredientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ingredients = useSelector((state) => state.ingredients.items);
  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return (
      <div className={styles.container}>
        <h1 className="text text_type_main-large mb-6">Ингредиент не найден</h1>
        <button
          onClick={() => navigate(-1)}
          className="text text_type_main-default text_color_accent"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <IngredientDetails />
    </div>
  );
};

export default IngredientPage;

