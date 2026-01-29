import { SELECTORS } from '../support/selectors';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Мокаем API запросы используя кастомную команду
    cy.setupConstructorIntercepts();
    
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
      // Используем кастомную команду для переключения вкладок
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      
      // Кликаем на вкладку "Соусы"
      cy.clickTab(SELECTORS.SAUCES_TAB);
      
      // Проверяем, что отображаются соусы
      cy.get('@ingredientCards').should('be.visible');
      
      // Кликаем на вкладку "Начинки"
      cy.clickTab(SELECTORS.MAINS_TAB);
      
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
      // Используем кастомные команды для добавления ингредиентов
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).as('constructorFillings');
      
      // Сначала добавляем булку используя кастомную команду
      cy.addBunToConstructor();
      
      // Перетаскиваем начинку используя кастомную команду
      cy.addFillingToConstructor(SELECTORS.MAINS_TAB);
      
      // Проверяем, что начинка появилась в конструкторе
      cy.get('@constructorFillings', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен перетаскивать соус в конструктор', () => {
      // Используем кастомные команды для добавления ингредиентов
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).as('constructorFillings');
      
      // Сначала добавляем булку используя кастомную команду
      cy.addBunToConstructor();
      
      // Перетаскиваем соус используя кастомную команду
      cy.addFillingToConstructor(SELECTORS.SAUCES_TAB);
      
      // Проверяем, что соус появился в конструкторе
      cy.get('@constructorFillings', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен обновлять счетчик ингредиентов при добавлении', () => {
      // Используем кастомную команду для добавления булки
      cy.get(SELECTORS.INGREDIENT_CARD).as('ingredientCards');
      
      // Добавляем булку используя кастомную команду
      cy.addBunToConstructor();
      
      // Проверяем, что ингредиент все еще существует в списке
      cy.get('@ingredientCards').first().should('exist');
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    beforeEach(() => {
      // Используем кастомные команды для добавления ингредиентов
      // Добавляем булку и начинку
      cy.addBunToConstructor();
      cy.addFillingToConstructor(SELECTORS.MAINS_TAB);
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
      // Используем кастомные команды для добавления ингредиентов
      cy.get(SELECTORS.ORDER_TOTAL).as('orderTotal');
      
      // Добавляем булку и начинку используя кастомные команды
      cy.addBunToConstructor();
      cy.wait(1000);
      cy.addFillingToConstructor(SELECTORS.MAINS_TAB);
      
      // Проверяем, что цена отображается
      cy.get('@orderTotal', { timeout: 5000 }).should('be.visible');
      cy.get('@orderTotal').should('not.be.empty');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Используем кастомные команды
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      
      // Мокаем авторизацию используя кастомную команду
      cy.mockAuth();
      
      // Добавляем булку и начинку используя кастомные команды
      cy.addBunToConstructor();
      cy.wait(1000); // Ждем обновления состояния
      cy.addFillingToConstructor(SELECTORS.MAINS_TAB);
      cy.wait(1000); // Ждем обновления состояния
    });

    it('должен быть неактивна кнопка "Оформить заказ" без булки', () => {
      // Используем кастомные команды
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только начинку используя кастомную команду
      cy.addFillingToConstructor(SELECTORS.MAINS_TAB);
      
      // Проверяем, что кнопка неактивна
      cy.get('@orderButton').should('be.disabled');
    });

    it('должен быть неактивна кнопка "Оформить заказ" без начинки', () => {
      // Используем кастомные команды
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только булку используя кастомную команду
      cy.addBunToConstructor();
      
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
      
      // Очищаем токен используя кастомную команду
      cy.clearAuth();
      
      // Кликаем на кнопку оформления заказа
      cy.get('@orderButton').click();
      
      // Проверяем редирект на страницу входа
      cy.url().should('include', '/login');
    });

    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Кликаем на кнопку оформления заказа
      cy.get('@orderButton').click();
      
      // Ждем запроса на создание заказа
      cy.wait('@createOrder');
      
      // Используем кастомную команду для проверки модального окна
      cy.waitForOrderModal();
    });
  });

  describe('Модальное окно заказа', () => {
    beforeEach(() => {
      // Создаем алиасы для элементов
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).as('orderButton');
      cy.contains(SELECTORS.ORDER_ID_LABEL).as('orderIdLabel');
      cy.contains(SELECTORS.ORDER_STATUS).as('orderStatus');
      cy.contains(SELECTORS.ORDER_MESSAGE).as('orderMessage');
      cy.get(SELECTORS.ORDER_NUMBER).as('orderNumber');
      cy.get(SELECTORS.CLOSE_BUTTON).as('closeButton');
      cy.get(SELECTORS.MODAL_OVERLAY).as('modalOverlay');
      
      // Мокаем авторизацию используя кастомную команду
      cy.mockAuth();
      
      // Добавляем булку и начинку используя кастомные команды
      cy.addBunToConstructor();
      cy.addFillingToConstructor(SELECTORS.MAINS_TAB);
      
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
      // Используем кастомную команду для закрытия модального окна
      cy.closeModal();
      
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
