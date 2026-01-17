import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './FeedOrderDetails.module.css';
import { Order } from '../../../utils/types';

// Тестовые данные для деталей заказа
const mockOrderDetails: Record<number, Order> = {
  34567: {
    number: 34567,
    name: 'Space крафт-бургер',
    status: 'done',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:35:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941', '643d69a5c3f7b9001cfa0943'],
  },
  34566: {
    number: 34566,
    name: 'Флюоресцентный бургер',
    status: 'pending',
    createdAt: '2024-01-15T10:25:00.000Z',
    updatedAt: '2024-01-15T10:25:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0942'],
  },
  34565: {
    number: 34565,
    name: 'Метеоритный бургер',
    status: 'done',
    createdAt: '2024-01-15T10:20:00.000Z',
    updatedAt: '2024-01-15T10:25:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
  },
  34564: {
    number: 34564,
    name: 'Экзо-планетный бургер',
    status: 'created',
    createdAt: '2024-01-15T10:15:00.000Z',
    updatedAt: '2024-01-15T10:15:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0943', '643d69a5c3f7b9001cfa0944'],
  },
};

const FeedOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as any)?.background;

  const orderNumber = id ? parseInt(id, 10) : null;
  const order = orderNumber ? mockOrderDetails[orderNumber] : null;

  if (!order) {
    return (
      <main className={`${styles.main} pt-10 pb-10`}>
        <div className={styles.container}>
          <h1 className="text text_type_main-large mb-6">Заказ не найден</h1>
          <button
            onClick={() => navigate(-1)}
            className="text text_type_main-default text_color_accent"
          >
            Вернуться назад
          </button>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  };

  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusClass = (status?: string): string => {
    switch (status) {
      case 'done':
        return styles.statusDone;
      case 'pending':
        return styles.statusPending;
      case 'created':
        return styles.statusCreated;
      default:
        return '';
    }
  };

  const calculatePrice = (ingredients?: string[]): number => {
    // Заглушка для расчета цены
    if (!ingredients || ingredients.length === 0) return 0;
    return ingredients.length * 100;
  };

  // Если есть background, значит открываем модалку
  if (background) {
    return (
      <div className={styles.container}>
        <div className={styles.orderNumber}>
          <span className="text text_type_digits-default">#{order.number}</span>
        </div>
        <h1 className={`text text_type_main-medium mb-3 ${styles.orderName}`}>
          {order.name || 'Без названия'}
        </h1>
        {order.status && (
          <p className={`text text_type_main-default mb-15 ${getStatusClass(order.status)}`}>
            {getStatusText(order.status)}
          </p>
        )}
        <div className={styles.ingredients}>
          <h2 className="text text_type_main-medium mb-6">Состав:</h2>
          <div className={styles.ingredientsList}>
            {order.ingredients?.map((ingredientId, index) => (
              <div key={index} className={styles.ingredientItem}>
                <div className={styles.ingredientIcon}></div>
                <span className="text text_type_main-default">Ингредиент {index + 1}</span>
                <span className="text text_type_digits-default">100 ₽</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footer}>
          <span className="text text_type_main-default text_color_inactive">
            {order.createdAt && formatDate(order.createdAt)}
          </span>
          <div className={styles.totalPrice}>
            <span className="text text_type_digits-default">
              {calculatePrice(order.ingredients)}
            </span>
            <span className="text text_type_digits-default ml-2">₽</span>
          </div>
        </div>
      </div>
    );
  }

  // Обычная страница
  return (
    <main className={`${styles.main} pt-10 pb-10`}>
      <div className={styles.container}>
        <div className={styles.orderNumber}>
          <span className="text text_type_digits-default">#{order.number}</span>
        </div>
        <h1 className={`text text_type_main-medium mb-3 ${styles.orderName}`}>
          {order.name || 'Без названия'}
        </h1>
        {order.status && (
          <p className={`text text_type_main-default mb-15 ${getStatusClass(order.status)}`}>
            {getStatusText(order.status)}
          </p>
        )}
        <div className={styles.ingredients}>
          <h2 className="text text_type_main-medium mb-6">Состав:</h2>
          <div className={styles.ingredientsList}>
            {order.ingredients?.map((ingredientId, index) => (
              <div key={index} className={styles.ingredientItem}>
                <div className={styles.ingredientIcon}></div>
                <span className="text text_type_main-default">Ингредиент {index + 1}</span>
                <span className="text text_type_digits-default">100 ₽</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footer}>
          <span className="text text_type_main-default text_color_inactive">
            {order.createdAt && formatDate(order.createdAt)}
          </span>
          <div className={styles.totalPrice}>
            <span className="text text_type_digits-default">
              {calculatePrice(order.ingredients)}
            </span>
            <span className="text text_type_digits-default ml-2">₽</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeedOrderDetails;
