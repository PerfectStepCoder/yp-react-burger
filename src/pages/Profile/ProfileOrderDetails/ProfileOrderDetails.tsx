import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../../hooks/useRedux';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ProfileOrderDetails.module.css';
import { FeedOrder, Ingredient } from '../../../utils/types';
import { request } from '../../../utils/request';
import { getAccessToken, getAuthHeaders } from '../../../services/actions/authActions';

interface IngredientWithCount {
  ingredient: Ingredient;
  count: number;
}

// Function to get burger name from ingredients
const getBurgerName = (order: FeedOrder, ingredients: Ingredient[]): string => {
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

const ProfileOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as any)?.background;
  const ingredients = useSelector((state) => state.ingredients.items as Ingredient[]);
  const userOrders = useSelector((state) => state.userOrders.orders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const orderNumber = id ? parseInt(id, 10) : null;
  const [order, setOrder] = useState<FeedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Сначала пытаемся найти заказ в WebSocket данных
  const orderFromState = orderNumber ? userOrders.find((o) => o.number === orderNumber) : null;

  // Если заказ найден в state, используем его
  useEffect(() => {
    if (orderFromState) {
      setOrder(orderFromState);
      setError(null);
      setHasFetched(true);
    }
  }, [orderFromState]);

  // Если заказ не найден в state и это прямой переход (нет background), загружаем с сервера
  useEffect(() => {
    if (!orderFromState && !background && orderNumber && !loading && !hasFetched) {
      // Получаем токен из state или cookies
      let token = accessToken;
      if (!token) {
        token = getAccessToken();
      }

      if (!token) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHasFetched(true);

      request<{ success: boolean; orders?: FeedOrder[]; order?: FeedOrder }>(`/orders/${orderNumber}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      })
        .then((response) => {
          // API возвращает напрямую {success: true, orders: [...]}
          // response.data может быть undefined, проверяем сам response
          if (response.success) {
            // Проверяем разные форматы ответа API
            let foundOrder: FeedOrder | undefined;
            
            // Формат 1: { success: true, order: {...} }
            if ('order' in response && response.order) {
              foundOrder = response.order as FeedOrder;
            }
            // Формат 2: { success: true, orders: [...] } - основной формат по API
            else if ('orders' in response && Array.isArray(response.orders)) {
              foundOrder = response.orders.find((o) => o.number === orderNumber);
            }
            // Формат 3: данные в response.data
            else if (response.data) {
              const responseData = response.data as { success: boolean; orders?: FeedOrder[]; order?: FeedOrder };
              if (responseData.order) {
                foundOrder = responseData.order as FeedOrder;
              } else if (responseData.orders && Array.isArray(responseData.orders)) {
                foundOrder = responseData.orders.find((o) => o.number === orderNumber);
              }
            }
            
            if (foundOrder && foundOrder.number === orderNumber) {
              setOrder(foundOrder);
            } else {
              setError('Заказ не найден');
            }
          } else {
            setError('Заказ не найден');
          }
        })
        .catch((err) => {
          console.error('Ошибка загрузки заказа:', err);
          setError('Ошибка загрузки заказа');
          setHasFetched(false); // Разрешаем повторную попытку при ошибке
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderFromState, background, orderNumber, hasFetched, accessToken]);

  const ingredientsWithCount = useMemo(() => {
    if (!order?.ingredients || !ingredients.length) return [];

    const ingredientMap = new Map<string, IngredientWithCount>();

    order.ingredients.forEach((ingredientId) => {
      const ingredient = ingredients.find((ing) => ing._id === ingredientId);
      if (ingredient) {
        const existing = ingredientMap.get(ingredientId);
        if (existing) {
          existing.count += 1;
        } else {
          ingredientMap.set(ingredientId, { ingredient, count: 1 });
        }
      }
    });

    return Array.from(ingredientMap.values());
  }, [order, ingredients]);

  const totalPrice = useMemo(() => {
    return ingredientsWithCount.reduce((total, item) => {
      return total + item.ingredient.price * item.count;
    }, 0);
  }, [ingredientsWithCount]);

  // Если это модальное окно и заказ не найден
  if (background && !order) {
    return null;
  }

  // Если прямой переход и заказ не найден
  if (!order) {
    const content = (
      <div className={styles.container}>
        {loading ? (
          <p className="text text_type_main-large">Загрузка заказа...</p>
        ) : (
          <>
            <h1 className="text text_type_main-large mb-6">
              {error || 'Заказ не найден'}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text text_type_main-default text_color_accent"
            >
              Вернуться назад
            </button>
          </>
        )}
      </div>
    );

    // Если прямой переход (нет background), оборачиваем в main
    if (!background) {
      return (
        <main className={`${styles.main} pt-10 pb-10`}>
          {content}
        </main>
      );
    }

    return content;
  }

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

  // Контент без обертки main (для модального окна)
  const content = (
    <div className={styles.container}>
      <div className={styles.orderNumber}>
              <span className="text text_type_digits-default">#{String(order.number).padStart(6, '0')}</span>
            </div>
            <h1 className={`text text_type_main-medium mb-3 ${styles.orderName}`}>
              {getBurgerName(order, ingredients)}
            </h1>
      {order.status && (
        <p className={`text text_type_main-default mb-15 ${getStatusClass(order.status)}`}>
          {getStatusText(order.status)}
        </p>
      )}
      <div className={styles.ingredients}>
        <h2 className="text text_type_main-medium mb-6">Состав:</h2>
        <div className={styles.ingredientsList}>
          {ingredientsWithCount.map((item) => (
            <div key={item.ingredient._id} className={styles.ingredientItem}>
              <div className={styles.ingredientIconWrapper}>
                <div className={styles.ingredientIcon}>
                  <img
                    src={item.ingredient.image}
                    alt={item.ingredient.name}
                    className={styles.ingredientImage}
                  />
                </div>
              </div>
              <span className={`text text_type_main-default ${styles.ingredientName}`}>
                {item.ingredient.name}
              </span>
              <div className={styles.ingredientPrice}>
                <span className="text text_type_digits-default mr-2">
                  {item.count} x {item.ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {order.createdAt && formatDate(order.createdAt)}
        </span>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );

  // Если есть background, значит открываем модалку (возвращаем только контент)
  if (background) {
    return content;
  }

  // Обычная страница (возвращаем только контент, т.к. он уже обернут в контейнер)
  return content;
};

export default ProfileOrderDetails;
