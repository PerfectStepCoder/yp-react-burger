import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { wsFeedConnectionStart, wsFeedConnectionClosed } from '../../services/actions/feedActions';
import styles from './Feed.module.css';
import { FeedOrder, Ingredient } from '../../utils/types';

const Feed: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.items as Ingredient[]);
  const feedState = useSelector((state) => state.feed);

  // Подключаемся к WebSocket при монтировании компонента
  useEffect(() => {
    const wsBaseUrl = process.env.REACT_APP_WS_BASE_URL || 'wss://norma.education-services.ru';
    const wsUrl = `${wsBaseUrl}/orders/all`;
    dispatch(wsFeedConnectionStart(wsUrl));

    // Отключаемся от WebSocket при размонтировании
    return () => {
      dispatch(wsFeedConnectionClosed());
    };
  }, [dispatch]);

  // Получаем название бургера из ингредиентов (не поступают эти данные из запроса)
  const getBurgerName = (order: FeedOrder): string => {
    if (!order.ingredients || order.ingredients.length === 0 || !ingredients.length) {
      return 'Бургер без названия';
    }

    // Берем уникальные ингредиенты
    const uniqueIngredientIds = Array.from(new Set(order.ingredients));
    const orderIngredients = uniqueIngredientIds
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing) => ing !== undefined) as Ingredient[];

    // Формируем название на основе типа ингредиентов
    const hasBun = orderIngredients.some((ing) => ing.type === 'bun');
    const hasMain = orderIngredients.some((ing) => ing.type === 'main');
    const hasSauce = orderIngredients.some((ing) => ing.type === 'sauce');

    if (hasMain && hasSauce) {
      return `${orderIngredients.find((ing) => ing.type === 'main')?.name || 'Бургер'} соусом`;
    }
    if (hasMain) {
      return `${orderIngredients.find((ing) => ing.type === 'main')?.name || 'Бургер'}`;
    }

    return 'Космический бургер';
  };

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

  // Формируем колонки "Готово" и "В работе" (максимум 10 записей в каждой, разбиваем на несколько колонок)
  const { readyOrdersColumns, inProgressOrdersColumns, totalCompleted, todayCompleted } = useMemo(() => {
    const ready = feedState.orders
      .filter((order) => order.status === 'done')
      .map((order) => order.number);
    const inProgress = feedState.orders
      .filter((order) => order.status === 'pending')
      .map((order) => order.number);
    
    // Разбиваем на колонки по 10 записей
    const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const readyColumns = chunkArray(ready, 10);
    const inProgressColumns = chunkArray(inProgress, 10);
    
    return {
      readyOrdersColumns: readyColumns,
      inProgressOrdersColumns: inProgressColumns,
      totalCompleted: feedState.total || 0,
      todayCompleted: feedState.totalToday || 0,
    };
  }, [feedState.orders, feedState.total, feedState.totalToday]);

  // Сортируем заказы по времени обновления (новые сверху)
  const sortedOrders = useMemo(() => {
    return [...feedState.orders].sort((a, b) => {
      const dateA = new Date(b.updatedAt || b.createdAt || 0).getTime();
      const dateB = new Date(a.updatedAt || a.createdAt || 0).getTime();
      return dateA - dateB;
    });
  }, [feedState.orders]);

  return (
    <main className={`${styles.main} pt-10 pb-10`}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
            <div className={styles.ordersList}>
              {feedState.error && (
                <div className="text text_type_main-default text_color_error mb-4">
                  Ошибка: {feedState.error}
                </div>
              )}
              {sortedOrders.length === 0 && !feedState.error && (
                <div className="text text_type_main-default text_color_inactive">
                  Загрузка заказов...
                </div>
              )}
              {sortedOrders.map((order) => {
                const uniqueIngredients = order.ingredients?.slice(0, 6) || [];
                const remainingCount = (order.ingredients?.length || 0) - uniqueIngredients.length;
                const price = calculatePrice(order.ingredients);
                const burgerName = getBurgerName(order);

                return (
                  <Link
                    key={order._id || order.number}
                    to={`/feed/${order.number}`}
                    state={{ background: location }}
                    className={styles.orderCard}
                  >
                    <div className={styles.orderHeader}>
                      <span className="text text_type_digits-default">
                        #{String(order.number).padStart(6, '0')}
                      </span>
                      <span className="text text_type_main-default text_color_inactive">
                        {order.createdAt && formatDate(order.createdAt)}
                      </span>
                    </div>
                    <h2 className={`text text_type_main-medium mb-2 ${styles.orderName}`}>
                      {burgerName}
                    </h2>
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

          <div className={styles.rightColumn}>
            <div className={styles.stats}>
              <div className={styles.statsSection}>
                <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
                <div className={styles.ordersGridsContainer}>
                  {readyOrdersColumns.length === 0 ? (
                    <div className={styles.ordersGrid}>
                      <span className="text text_type_main-default text_color_inactive">
                        Нет готовых заказов
                      </span>
                    </div>
                  ) : (
                    readyOrdersColumns.map((column, columnIndex) => (
                      <div key={columnIndex} className={styles.ordersGrid}>
                        {column.map((orderNumber) => (
                          <Link
                            key={orderNumber}
                            to={`/feed/${orderNumber}`}
                            state={{ background: location }}
                            className={`text text_type_digits-default ${styles.readyOrderLink}`}
                          >
                            {String(orderNumber).padStart(6, '0')}
                          </Link>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.statsSection}>
                <h2 className="text text_type_main-medium mb-6">В работе:</h2>
                <div className={styles.ordersGridsContainer}>
                  {inProgressOrdersColumns.length === 0 ? (
                    <div className={styles.ordersGrid}>
                      <span className="text text_type_main-default text_color_inactive">
                        Нет заказов в работе
                      </span>
                    </div>
                  ) : (
                    inProgressOrdersColumns.map((column, columnIndex) => (
                      <div key={columnIndex} className={styles.ordersGrid}>
                        {column.map((orderNumber) => (
                          <Link
                            key={orderNumber}
                            to={`/feed/${orderNumber}`}
                            state={{ background: location }}
                            className="text text_type_digits-default"
                          >
                            {String(orderNumber).padStart(6, '0')}
                          </Link>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.statsSection}>
                <h2 className="text text_type_main-medium mb-6">Выполнено за все время:</h2>
                <p className={`text text_type_digits-large ${styles.glowNumber}`}>
                  {totalCompleted.toLocaleString('ru-RU')}
                </p>
              </div>

              <div className={styles.statsSection}>
                <h2 className="text text_type_main-medium mb-6">Выполнено за сегодня:</h2>
                <p className={`text text_type_digits-large ${styles.glowNumber}`}>
                  {todayCompleted.toLocaleString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
