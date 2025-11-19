import React from 'react';
import PropTypes from 'prop-types';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Modal from '../Modal/Modal';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ orderNumber, onClose }) => {
  return (
    <Modal title="" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.orderNumber}>
          <span className="text text_type_digits-large">{orderNumber}</span>
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
    </Modal>
  );
};

OrderDetails.propTypes = {
  orderNumber: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetails;

