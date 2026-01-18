import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../hooks/useRedux';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { wsUserOrdersConnectionStart, wsUserOrdersConnectionClosed } from '../../../services/actions/userOrdersActions';
import styles from './ProfileOrders.module.css';
import { FeedOrder, Ingredient } from '../../../utils/types';

const ProfileOrders: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.items as Ingredient[]);
  const userOrdersState = useSelector((state) => state.userOrders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  // Подключаемся к WebSocket при монтировании компонента
  useEffect(() => {
    if (accessToken) {
      dispatch(wsUserOrdersConnectionStart(accessToken));
    }

    // Отключаемся от WebSocket при размонтировании
    return () => {
      dispatch(wsUserOrdersConnectionClosed());
    };
  }, [dispatch, accessToken]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    const timeStr = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    if (diffDays === 0) {
      return `Сегодня, ${timeStr} i-GMT+3`;
    } else if (diffDays === 1) {
      return `Вчера, ${timeStr} i-GMT+3`;
    } else {
      return `${diffDays} дня назад, ${timeStr} i-GMT+3`;
    }
  };

  const calculatePrice = (ingredientIds?: string[]): number => {
    if (!ingredientIds || ingredientIds.length === 0 || !ingredients.length) return 0;
    return ingredientIds.reduce((total, id) => {
      const ingredient = ingredients.find((ing) => ing._id === id);
      return total + (ingredient?.price || 0);
    }, 0);
  };

  const getIngredientImage = (ingredientId: string): string | undefined => {
    const ingredient = ingredients.find((ing) => ing._id === ingredientId);
    return ingredient?.image;
  };

  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      case 'canceled':
        return 'Отменен';
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
      case 'canceled':
        return styles.statusCanceled;
      case 'created':
        return styles.statusCreated;
      default:
        return '';
    }
  };

  // Получаем название бургера из ингредиентов
  const getBurgerName = (order: FeedOrder): string => {
    if (!order.ingredients || order.ingredients.length === 0 || !ingredients.length) {
      return 'Бургер без названия';
    }
    const uniqueIngredientIds = Array.from(new Set(order.ingredients));
    const orderIngredients = uniqueIngredientIds
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing) => ing !== undefined) as Ingredient[];

    const hasBun = orderIngredients.some((ing) => ing.type === 'bun');
    const hasMain = orderIngredients.some((ing) => ing.type === 'main');
    const hasSauce = orderIngredients.some((ing) => ing.type === 'sauce');

    if (hasBun && (hasMain || hasSauce)) {
      const bunName = orderIngredients.find((ing) => ing.type === 'bun')?.name;
      const mainOrSauceName = orderIngredients.find((ing) => ing.type === 'main' || ing.type === 'sauce')?.name;
      return `${bunName || 'Булка'} с ${mainOrSauceName || 'начинкой'}`;
    }
    return 'Космический бургер';
  };

  // Сортируем заказы по дате обновления (новые первыми)
  const sortedOrders = useMemo(() => {
    return [...userOrdersState.orders].sort((a, b) => {
      const dateA = new Date(b.updatedAt || b.createdAt || 0).getTime();
      const dateB = new Date(a.updatedAt || a.createdAt || 0).getTime();
      return dateA - dateB;
    });
  }, [userOrdersState.orders]);

  return (
    <div className={styles.container}>
      <div className={styles.ordersList}>
        {userOrdersState.error && (
          <div className="text text_type_main-default text_color_error mb-4">
            Ошибка: {userOrdersState.error}
          </div>
        )}
        {sortedOrders.length === 0 && !userOrdersState.error && (
          <div className="text text_type_main-default text_color_inactive">
            Загрузка заказов...
          </div>
        )}
        {sortedOrders.map((order) => {
          const uniqueIngredients = order.ingredients?.slice(0, 6) || [];
          const remainingCount = (order.ingredients?.length || 0) - uniqueIngredients.length;
          const price = calculatePrice(order.ingredients);

          return (
            <Link
              key={order.number}
              to={`/profile/orders/${order.number}`}
              state={{ background: location }}
              className={styles.orderCard}
            >
              <div className={styles.orderHeader}>
                <span className="text text_type_digits-default">#{String(order.number).padStart(6, '0')}</span>
                <span className="text text_type_main-default text_color_inactive">
                  {order.createdAt && formatDate(order.createdAt)}
                </span>
              </div>
              <h2 className={`text text_type_main-medium mb-2 ${styles.orderName}`}>
                {getBurgerName(order)}
              </h2>
              {order.status && (
                <p className={`text text_type_main-default mb-6 ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </p>
              )}
              <div className={styles.orderFooter}>
                <div className={styles.ingredientsPreview}>
                  {uniqueIngredients.map((ingredientId, index) => {
                    const image = getIngredientImage(ingredientId);
                    return (
                      <div
                        key={`${ingredientId}-${index}`}
                        className={styles.ingredientIcon}
                      >
                        {image && (
                          <img
                            src={image}
                            alt=""
                            className={styles.ingredientImage}
                          />
                        )}
                        {index === uniqueIngredients.length - 1 && remainingCount > 0 && (
                          <div className={styles.overlay}>
                            <span className="text text_type_digits-default">+{remainingCount}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.price}>
                  <span className="text text_type_digits-default mr-2">{price}</span>
                  <CurrencyIcon type="primary" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileOrders;
