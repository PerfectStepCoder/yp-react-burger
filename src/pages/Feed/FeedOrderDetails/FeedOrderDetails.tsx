import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../../hooks/useRedux';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './FeedOrderDetails.module.css';
import { FeedOrder, Ingredient } from '../../../utils/types';

// Функция для получения названия бургера из ингредиентов
const getBurgerName = (order: FeedOrder, ingredients: Ingredient[]): string => {
  if (!order.ingredients || order.ingredients.length === 0 || !ingredients.length) {
    return 'Бургер без названия';
  }

  const uniqueIngredientIds = Array.from(new Set(order.ingredients));
  const orderIngredients = uniqueIngredientIds
    .map((id) => ingredients.find((ing) => ing._id === id))
    .filter((ing) => ing !== undefined) as Ingredient[];

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

interface IngredientWithCount {
  ingredient: Ingredient;
  count: number;
}

const FeedOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as any)?.background;
  const ingredients = useSelector((state) => state.ingredients.items as Ingredient[]);
  const feedOrders = useSelector((state) => state.feed.orders as FeedOrder[]);

  const orderNumber = id ? parseInt(id, 10) : null;
  // Сначала пытаемся найти заказ в WebSocket данных, если нет - используем mock данные
  const order = orderNumber
    ? feedOrders.find((o) => o.number === orderNumber)
    : null;

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

  // Обычная страница (возвращаем контент с оберткой main)
  return (
    <main className={`${styles.main} pt-10 pb-10`}>
      {content}
    </main>
  );
};

export default FeedOrderDetails;
