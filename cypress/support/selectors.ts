// Константы селекторов для тестов конструктора бургера

export const SELECTORS = {
  // Вкладки
  BUNS_TAB: 'Булки',
  SAUCES_TAB: 'Соусы',
  MAINS_TAB: 'Начинки',
  
  // Элементы ингредиентов
  INGREDIENT_CARD: '[data-testid="ingredient-card"]',
  CONSTRUCTOR_FILLING: '[data-testid="constructor-filling"]',
  
  // Зоны drop
  BUN_DROP_ZONE: 'Перетащите булку сюда',
  FILLING_DROP_ZONE: 'Перетащите ингредиенты сюда',
  
  // Элементы конструктора
  BUN_TOP: '(верх)',
  BUN_BOTTOM: '(низ)',
  
  // Кнопки
  ORDER_BUTTON: 'Оформить заказ',
  CLOSE_BUTTON: 'button[aria-label="Закрыть"]',
  
  // Модальное окно заказа
  ORDER_ID_LABEL: 'идентификатор заказа',
  ORDER_STATUS: 'Ваш заказ начали готовить',
  ORDER_MESSAGE: 'Дождитесь готовности на орбитальной станции',
  ORDER_NUMBER: '[data-testid="order-number"]',
  ORDER_TOTAL: '[data-testid="order-total"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',
  
  // Заголовки
  PAGE_TITLE: 'Соберите бургер',
} as const;
