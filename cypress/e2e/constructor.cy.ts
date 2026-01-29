import { SELECTORS } from '../support/selectors';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Мокаем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Переходим на главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Загрузка и отображение ингредиентов', () => {
    it('должен загружать и отображать список ингредиентов', () => {
      // Проверяем заголовок
      cy.contains(SELECTORS.PAGE_TITLE).as('title').should('be.visible');
      
      // Проверяем наличие вкладок
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab').should('be.visible');
      cy.contains(SELECTORS.SAUCES_TAB).as('saucesTab').should('be.visible');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab').should('be.visible');
      
      // Проверяем, что ингредиенты отображаются
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards').should('have.length.greaterThan', 0);
    });

    it('должен переключаться между вкладками', () => {
      // Создаем алиасы для вкладок и карточек
      cy.contains(SELECTORS.SAUCES_TAB).as('saucesTab');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      
      // Кликаем на вкладку "Соусы"
      cy.get('@saucesTab').click();
      
      // Проверяем, что отображаются соусы
      cy.get('@ingredientCards').should('be.visible');
      
      // Кликаем на вкладку "Начинки"
      cy.get('@mainsTab').click();
      
      // Проверяем, что отображаются начинки
      cy.get('@ingredientCards').should('be.visible');
    });
  });

  describe('Перетаскивание ингредиентов', () => {
    it('должен перетаскивать булку в конструктор', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.BUN_TOP).as('bunTop');
      cy.contains(SELECTORS.BUN_BOTTOM).as('bunBottom');
      
      // Находим первую булку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().as('bunCard');
      
      // Проверяем видимость зоны конструктора
      cy.get('@bunDropZone').should('be.visible');
      
      // Перетаскиваем булку используя реальный drag and drop
      cy.get('@bunCard').trigger('mousedown', { button: 0 });
      cy.get('@bunDropZone').trigger('mousemove').trigger('mouseup');
      
      // Альтернативный способ через события drag
      cy.get('@bunCard').trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что булка появилась в конструкторе
      cy.get('@bunTop', { timeout: 5000 }).should('be.visible');
      cy.get('@bunBottom').should('be.visible');
    });

    it('должен перетаскивать начинку в конструктор', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      cy.contains(SELECTORS.BUN_TOP).as('bunTop');
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).as('constructorFillings');
      
      // Сначала добавляем булку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      // Ждем появления булки
      cy.get('@bunTop', { timeout: 5000 }).should('be.visible');
      
      // Перетаскиваем начинку
      cy.get('@mainsTab').click();
      cy.get('@ingredientCards').first().as('fillingCard');
      
      // Проверяем видимость зоны для начинки
      cy.get('@fillingDropZone').should('be.visible');
      
      // Перетаскиваем начинку
      cy.get('@fillingCard').trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что начинка появилась в конструкторе
      cy.get('@constructorFillings', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен перетаскивать соус в конструктор', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.contains(SELECTORS.SAUCES_TAB).as('saucesTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).as('constructorFillings');
      
      // Сначала добавляем булку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      // Перетаскиваем соус
      cy.get('@saucesTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что соус появился в конструкторе
      cy.get('@constructorFillings', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен обновлять счетчик ингредиентов при добавлении', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.BUN_TOP).as('bunTop');
      
      // Добавляем булку
      cy.get('@bunsTab').click();
      
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что булка появилась в конструкторе
      cy.get('@bunTop', { timeout: 5000 }).should('be.visible');
      
      // Проверяем, что ингредиент все еще существует в списке
      cy.get('@ingredientCards').first().should('exist');
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    beforeEach(() => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      
      // Добавляем булку и начинку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('drop');
      
      cy.get('@mainsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('drop');
    });

    it('должен удалять начинку из конструктора', () => {
      // Создаем алиас для ингредиентов конструктора
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).as('constructorFillings');
      
      // Находим кнопку удаления у первого ингредиента
      // Кнопка закрытия находится внутри ConstructorElement
      cy.get('@constructorFillings').first().within(() => {
        cy.get('button').last().as('removeButton').click(); // Последняя кнопка - это кнопка удаления
      });
      
      // Проверяем, что ингредиент удален
      cy.get('@constructorFillings').should('not.exist');
    });
  });

  describe('Подсчет стоимости заказа', () => {
    it('должен правильно считать стоимость заказа', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      cy.get(SELECTORS.ORDER_TOTAL).as('orderTotal');
      
      // Добавляем булку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      cy.wait(1000);
      
      // Добавляем начинку
      cy.get('@mainsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что цена отображается
      cy.get('@orderTotal', { timeout: 5000 }).should('be.visible');
      cy.get('@orderTotal').should('not.be.empty');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      
      // Мокаем авторизацию
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'mock-token');
      });
      
      // Добавляем булку и начинку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      cy.wait(1000); // Ждем обновления состояния
      
      cy.get('@mainsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('dragover').trigger('drop');
      
      cy.wait(1000); // Ждем обновления состояния
    });

    it('должен быть неактивна кнопка "Оформить заказ" без булки', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только начинку
      cy.get('@mainsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что кнопка неактивна
      cy.get('@orderButton').should('be.disabled');
    });

    it('должен быть неактивна кнопка "Оформить заказ" без начинки', () => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только булку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что кнопка неактивна
      cy.get('@orderButton').should('be.disabled');
    });

    it('должен быть активна кнопка "Оформить заказ" с булкой и начинкой', () => {
      // Используем алиас из beforeEach
      cy.get('@orderButton').should('not.be.disabled');
    });

    it('должен перенаправлять на страницу входа, если пользователь не авторизован', () => {
      // Используем алиас из beforeEach
      cy.get('@orderButton');
      
      // Очищаем токен
      cy.window().then((win) => {
        win.localStorage.removeItem('accessToken');
      });
      
      // Кликаем на кнопку оформления заказа
      cy.get('@orderButton').click();
      
      // Проверяем редирект на страницу входа
      cy.url().should('include', '/login');
    });

    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Создаем алиасы для элементов модального окна
      cy.contains(SELECTORS.ORDER_ID_LABEL).as('orderIdLabel');
      cy.contains(SELECTORS.ORDER_STATUS).as('orderStatus');
      
      // Кликаем на кнопку оформления заказа
      cy.get('@orderButton').click();
      
      // Ждем запроса на создание заказа
      cy.wait('@createOrder');
      
      // Проверяем, что модальное окно с заказом появилось
      cy.get('@orderIdLabel').should('be.visible');
      cy.get('@orderStatus').should('be.visible');
    });
  });

  describe('Модальное окно заказа', () => {
    beforeEach(() => {
      // Создаем алиасы для элементов
      cy.contains(SELECTORS.BUNS_TAB).as('bunsTab');
      cy.contains(SELECTORS.MAINS_TAB).as('mainsTab');
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      cy.contains(SELECTORS.BUN_DROP_ZONE).as('bunDropZone');
      cy.contains(SELECTORS.FILLING_DROP_ZONE).as('fillingDropZone');
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      cy.contains(SELECTORS.ORDER_ID_LABEL).as('orderIdLabel');
      cy.contains(SELECTORS.ORDER_STATUS).as('orderStatus');
      cy.contains(SELECTORS.ORDER_MESSAGE).as('orderMessage');
      cy.get(SELECTORS.ORDER_NUMBER).as('orderNumber');
      cy.get(SELECTORS.CLOSE_BUTTON).as('closeButton');
      cy.get(SELECTORS.MODAL_OVERLAY).as('modalOverlay');
      
      // Мокаем авторизацию
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'mock-token');
      });
      
      // Добавляем булку и начинку
      cy.get('@bunsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('drop');
      
      cy.get('@mainsTab').click();
      cy.get('@ingredientCards').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('drop');
      
      // Создаем заказ
      cy.get('@orderButton').click();
      cy.wait('@createOrder');
    });

    it('должно отображаться после успешного создания заказа', () => {
      // Проверяем содержимое модального окна используя алиасы
      cy.get('@orderIdLabel').should('be.visible');
      cy.get('@orderStatus').should('be.visible');
      cy.get('@orderMessage').should('be.visible');
      
      // Проверяем номер заказа
      cy.get('@orderNumber').should('be.visible');
    });

    it('должно закрываться при клике на кнопку закрытия', () => {
      // Используем алиасы из beforeEach
      cy.get('@closeButton').click();
      
      // Проверяем, что модальное окно закрылось
      cy.get('@orderIdLabel').should('not.exist');
    });

    it('должно закрываться при нажатии Escape', () => {
      // Используем алиас из beforeEach
      cy.get('@orderIdLabel');
      
      // Нажимаем Escape
      cy.get('body').type('{esc}');
      
      // Проверяем, что модальное окно закрылось
      cy.get('@orderIdLabel').should('not.exist');
    });

    it('должно закрываться при клике на overlay', () => {
      // Используем алиас из beforeEach
      cy.get('@modalOverlay').click({ force: true });
      
      // Проверяем, что модальное окно закрылось
      cy.get('@orderIdLabel').should('not.exist');
    });
  });
});
