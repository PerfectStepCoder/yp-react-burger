import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_digits-large mb-8">404</h1>
      <p className="text text_type_main-medium mb-10">Страница не найдена</p>
      <Link to="/">
        <Button type="primary" size="medium">
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;


