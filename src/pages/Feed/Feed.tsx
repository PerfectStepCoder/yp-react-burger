import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Feed.module.css';
import { Order } from '../../utils/types';

// Тестовые данные для списка заказов
const mockOrders: Order[] = [
  {
    number: 34567,
    name: 'Space крафт-бургер',
    status: 'done',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:35:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941', '643d69a5c3f7b9001cfa0943'],
  },
  {
    number: 34566,
    name: 'Флюоресцентный бургер',
    status: 'pending',
    createdAt: '2024-01-15T10:25:00.000Z',
    updatedAt: '2024-01-15T10:25:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0942'],
  },
  {
    number: 34565,
    name: 'Метеоритный бургер',
    status: 'done',
    createdAt: '2024-01-15T10:20:00.000Z',
    updatedAt: '2024-01-15T10:25:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
  },
  {
    number: 34564,
    name: 'Экзо-планетный бургер',
    status: 'created',
    createdAt: '2024-01-15T10:15:00.000Z',
    updatedAt: '2024-01-15T10:15:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0943', '643d69a5c3f7b9001cfa0944'],
  },
];

const Feed: React.FC = () => {
  const location = useLocation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'только что';
    }
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'минуту' : diffMins < 5 ? 'минуты' : 'минут'} назад`;
    }
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`;
    }
    if (diffDays === 1) {
      return 'вчера';
    }
    return `${diffDays} дня назад`;
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
    // Заглушка для расчета цены - в реальном приложении нужно получать цены ингредиентов
    if (!ingredients || ingredients.length === 0) return 0;
    return ingredients.length * 100; // Примерная цена
  };

  return (
    <main className={`${styles.main} pt-10 pb-10`}>
      <div className={styles.container}>
        <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
        <div className={styles.content}>
          <div className={styles.ordersList}>
            {mockOrders.map((order) => (
              <Link
                key={order.number}
                to={`/feed/${order.number}`}
                state={{ background: location }}
                className={styles.orderCard}
              >
                <div className={styles.orderHeader}>
                  <span className="text text_type_digits-default">#{order.number}</span>
                  <span className="text text_type_main-default text_color_inactive">
                    {formatDate(order.createdAt || '')}
                  </span>
                </div>
                <h2 className={`text text_type_main-medium mb-2 ${styles.orderName}`}>
                  {order.name || 'Без названия'}
                </h2>
                {order.status && (
                  <p className={`text text_type_main-default mb-6 ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </p>
                )}
                <div className={styles.orderFooter}>
                  <div className={styles.ingredientsPreview}>
                    {/* Заглушка для превью ингредиентов */}
                    <div className={styles.ingredientIcon}></div>
                    <div className={styles.ingredientIcon}></div>
                    <div className={styles.ingredientIcon}></div>
                    {order.ingredients && order.ingredients.length > 3 && (
                      <span className="text text_type_digits-default">
                        +{order.ingredients.length - 3}
                      </span>
                    )}
                  </div>
                  <div className={styles.price}>
                    <span className="text text_type_digits-default">
                      {calculatePrice(order.ingredients)}
                    </span>
                    <span className="text text_type_digits-default ml-2">₽</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
