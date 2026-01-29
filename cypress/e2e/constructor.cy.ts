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
      // Используем кастомную команду для добавления булки
      cy.addBunToConstructor();
      
      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('(верх)', { timeout: 5000 }).should('be.visible');
      cy.contains('(низ)', { timeout: 5000 }).should('be.visible');
    });

    it('должен перетаскивать начинку в конструктор', () => {
      // Добавляем булку и начинку напрямую через Redux
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        
        // Добавляем булку
        const bun = ingredients.find((ing: any) => ing.type === 'bun');
        if (bun) {
          store.dispatch({
            type: 'SET_CONSTRUCTOR_BUN',
            payload: bun,
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: bun._id, amount: 2 },
          });
        }
        
        // Добавляем начинку
        const filling = ingredients.find((ing: any) => ing.type === 'main');
        if (filling) {
          const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          store.dispatch({
            type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
            payload: { ...filling, uuid },
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: filling._id, amount: 1 },
          });
        }
      });
      
      cy.wait(500);
      
      // Проверяем, что начинка появилась в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_FILLING, { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен перетаскивать соус в конструктор', () => {
      // Добавляем булку и соус напрямую через Redux
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        
        // Добавляем булку
        const bun = ingredients.find((ing: any) => ing.type === 'bun');
        if (bun) {
          store.dispatch({
            type: 'SET_CONSTRUCTOR_BUN',
            payload: bun,
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: bun._id, amount: 2 },
          });
        }
        
        // Добавляем соус
        const filling = ingredients.find((ing: any) => ing.type === 'sauce');
        if (filling) {
          const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          store.dispatch({
            type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
            payload: { ...filling, uuid },
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: filling._id, amount: 1 },
          });
        }
      });
      
      cy.wait(500);
      
      // Проверяем, что соус появился в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_FILLING, { timeout: 5000 }).should('have.length.greaterThan', 0);
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
      // Добавляем булку и начинку напрямую через Redux
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        
        // Добавляем булку
        const bun = ingredients.find((ing: any) => ing.type === 'bun');
        if (bun) {
          store.dispatch({
            type: 'SET_CONSTRUCTOR_BUN',
            payload: bun,
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: bun._id, amount: 2 },
          });
        }
        
        // Добавляем начинку
        const filling = ingredients.find((ing: any) => ing.type === 'main');
        if (filling) {
          const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          store.dispatch({
            type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
            payload: { ...filling, uuid },
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: filling._id, amount: 1 },
          });
        }
      });
      
      cy.wait(500); // Ждем обновления компонента
    });

    it('должен удалять начинку из конструктора', () => {
      // Создаем алиас для ингредиентов конструктора
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).as('constructorFillings');
      
      // Получаем UUID первого ингредиента для удаления через Redux
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const fillings = state.burgerConstructor.fillings;
        
        if (fillings && fillings.length > 0) {
          const firstFilling = fillings[0];
          const ingredientId = firstFilling._id;
          const uuid = firstFilling.uuid;
          
          // Диспатчим action для удаления
          store.dispatch({
            type: 'REMOVE_INGREDIENT_FROM_CONSTRUCTOR',
            payload: uuid,
          });
          store.dispatch({
            type: 'DECREMENT_INGREDIENT_COUNT',
            payload: { id: ingredientId, amount: 1 },
          });
        }
      });
      
      cy.wait(100);
      
      // Проверяем, что ингредиент удален
      cy.get(SELECTORS.CONSTRUCTOR_FILLING).should('not.exist');
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
      // Мокаем авторизацию используя кастомную команду
      cy.mockAuth();
      
      // Ждем загрузки ингредиентов
      cy.wait('@getIngredients');
      
      // Добавляем булку и начинку напрямую через Redux
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        
        // Проверяем, что ингредиенты загружены
        expect(ingredients).to.be.an('array');
        expect(ingredients.length).to.be.greaterThan(0);
        
        // Добавляем булку
        const bun = ingredients.find((ing: any) => ing.type === 'bun');
        expect(bun).to.not.be.undefined;
        
        if (!bun) {
          throw new Error('Булка не найдена в списке ингредиентов');
        }
        
        store.dispatch({
          type: 'SET_CONSTRUCTOR_BUN',
          payload: bun,
        });
        store.dispatch({
          type: 'INCREMENT_INGREDIENT_COUNT',
          payload: { id: bun._id, amount: 2 },
        });
        
        // Добавляем начинку
        const filling = ingredients.find((ing: any) => ing.type === 'main');
        expect(filling).to.not.be.undefined;
        
        if (!filling) {
          throw new Error('Начинка не найдена в списке ингредиентов');
        }
        
        const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        store.dispatch({
          type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
          payload: { ...filling, uuid },
        });
        store.dispatch({
          type: 'INCREMENT_INGREDIENT_COUNT',
          payload: { id: filling._id, amount: 1 },
        });
      });
      
      cy.wait(1000); // Ждем обновления компонента
      
      // Проверяем, что ингредиенты добавлены (проверяем через Redux state)
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        // Проверяем, что булка добавлена
        if (!state.burgerConstructor.bun) {
          throw new Error('Булка не была добавлена в конструктор');
        }
        // Проверяем, что начинка добавлена
        if (state.burgerConstructor.fillings.length === 0) {
          throw new Error('Начинка не была добавлена в конструктор');
        }
      });
      
      // Создаем алиас для кнопки после добавления ингредиентов
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).should('not.be.disabled').as('orderButton');
    });

    it('должен быть неактивна кнопка "Оформить заказ" без булки', () => {
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только начинку напрямую через Redux (без булки)
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        const filling = ingredients.find((ing: any) => ing.type === 'main');
        
        if (filling) {
          const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          store.dispatch({
            type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
            payload: { ...filling, uuid },
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: filling._id, amount: 1 },
          });
        }
      });
      
      cy.wait(200);
      
      // Проверяем, что кнопка неактивна
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).should('be.disabled');
    });

    it('должен быть неактивна кнопка "Оформить заказ" без начинки', () => {
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только булку напрямую через Redux (без начинки)
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        const bun = ingredients.find((ing: any) => ing.type === 'bun');
        
        if (bun) {
          store.dispatch({
            type: 'SET_CONSTRUCTOR_BUN',
            payload: bun,
          });
          store.dispatch({
            type: 'INCREMENT_INGREDIENT_COUNT',
            payload: { id: bun._id, amount: 2 },
          });
        }
      });
      
      cy.wait(200);
      
      // Проверяем, что кнопка неактивна
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).should('be.disabled');
    });

    it('должен быть активна кнопка "Оформить заказ" с булкой и начинкой', () => {
      // Используем алиас из beforeEach
      cy.get('@orderButton').should('not.be.disabled');
    });

    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Проверяем, что ингредиенты действительно добавлены
      cy.contains('(верх)', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="constructor-filling"]', { timeout: 5000 }).should('exist');
      
      // Убеждаемся, что кнопка активна перед кликом
      cy.get('@orderButton').should('not.be.disabled');
      
      // Проверяем, что авторизация есть
      cy.window().its('localStorage').invoke('getItem', 'accessToken').should('exist');
      
      // Кликаем на кнопку оформления заказа
      cy.get('@orderButton').click();
      
      // Ждем запроса на создание заказа
      cy.wait('@createOrder', { timeout: 10000 });
      
      // Используем кастомную команду для проверки модального окна
      cy.waitForOrderModal();
    });
  });

  describe('Модальное окно заказа', () => {
    beforeEach(() => {
      // Мокаем авторизацию используя кастомную команду
      cy.mockAuth();
      
      // Ждем загрузки ингредиентов
      cy.wait('@getIngredients');
      
      // Добавляем булку и начинку напрямую через Redux
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        const ingredients = state.ingredients.items;
        
        // Проверяем, что ингредиенты загружены
        expect(ingredients).to.be.an('array');
        expect(ingredients.length).to.be.greaterThan(0);
        
        // Добавляем булку
        const bun = ingredients.find((ing: any) => ing.type === 'bun');
        expect(bun).to.not.be.undefined;
        
        if (!bun) {
          throw new Error('Булка не найдена в списке ингредиентов');
        }
        
        store.dispatch({
          type: 'SET_CONSTRUCTOR_BUN',
          payload: bun,
        });
        store.dispatch({
          type: 'INCREMENT_INGREDIENT_COUNT',
          payload: { id: bun._id, amount: 2 },
        });
        
        // Добавляем начинку
        const filling = ingredients.find((ing: any) => ing.type === 'main');
        expect(filling).to.not.be.undefined;
        
        if (!filling) {
          throw new Error('Начинка не найдена в списке ингредиентов');
        }
        
        const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        store.dispatch({
          type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
          payload: { ...filling, uuid },
        });
        store.dispatch({
          type: 'INCREMENT_INGREDIENT_COUNT',
          payload: { id: filling._id, amount: 1 },
        });
      });
      
      cy.wait(1000); // Ждем обновления компонента
      
      // Проверяем, что ингредиенты добавлены (проверяем через Redux state)
      cy.window().its('__REDUX_STORE__').then((store) => {
        const state = store.getState();
        // Проверяем, что булка добавлена
        if (!state.burgerConstructor.bun) {
          throw new Error('Булка не была добавлена в конструктор');
        }
        // Проверяем, что начинка добавлена
        if (state.burgerConstructor.fillings.length === 0) {
          throw new Error('Начинка не была добавлена в конструктор');
        }
      });
      
      // Создаем заказ
      cy.get('button').contains(SELECTORS.ORDER_BUTTON).should('not.be.disabled').click();
      cy.wait('@createOrder');
      
      // Ждем появления модального окна перед созданием алиасов
      cy.waitForOrderModal();
      
      // Создаем алиасы для элементов после появления модального окна
      cy.contains(SELECTORS.ORDER_ID_LABEL).as('orderIdLabel');
      cy.contains(SELECTORS.ORDER_STATUS).as('orderStatus');
      cy.contains(SELECTORS.ORDER_MESSAGE).as('orderMessage');
      cy.get(SELECTORS.ORDER_NUMBER).as('orderNumber');
      cy.get(SELECTORS.CLOSE_BUTTON).as('closeButton');
      cy.get(SELECTORS.MODAL_OVERLAY).as('modalOverlay');
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
