import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProfileOrderDetails.module.css';

const ProfileOrderDetails = () => {
  const { id } = useParams();

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mb-6">Детали заказа #{id}</h1>
      <p className="text text_type_main-default text_color_inactive">
        Детали заказа в разработке
      </p>
    </div>
  );
};

export default ProfileOrderDetails;



