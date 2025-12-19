import React from 'react';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetails.module.css';

interface OrderDetailsProps {
  orderNumber: number | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderNumber }) => {
  return (
    <div className={styles.content}>
      <div className={styles.orderNumber}>
        <span className="text text_type_digits-large">
          {orderNumber ?? '—'}
        </span>
      </div>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={styles.iconWrapper}>
        <div className={styles.iconCircle}>
          <CheckMarkIcon type="primary" />
        </div>
      </div>
      <p className="text text_type_main-default mb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
