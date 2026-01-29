/// <reference types="cypress" />
import { SELECTORS } from './selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to drag and drop an element
       * @example cy.dragAndDrop('[data-testid="ingredient"]', '[data-testid="constructor"]')
       */
      dragAndDrop(source: string | Chainable, target: string | Chainable): Chainable<void>;
      
      /**
       * Custom command to login user
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Click on a tab by text
       * @example cy.clickTab('Булки')
       */
      clickTab(tabName: string): Chainable<void>;
      
      /**
       * Add bun to constructor
       * @example cy.addBunToConstructor()
       */
      addBunToConstructor(): Chainable<void>;
      
      /**
       * Add filling ingredient to constructor
       * @example cy.addFillingToConstructor('Начинки')
       */
      addFillingToConstructor(tabName: string): Chainable<void>;
      
      /**
       * Setup API intercepts for constructor page
       * @example cy.setupConstructorIntercepts()
       */
      setupConstructorIntercepts(): Chainable<void>;
      
      /**
       * Mock authentication token
       * @example cy.mockAuth('mock-token')
       */
      mockAuth(token?: string): Chainable<void>;
      
      /**
       * Clear authentication token
       * @example cy.clearAuth()
       */
      clearAuth(): Chainable<void>;
      
      /**
       * Wait for order modal to appear
       * @example cy.waitForOrderModal()
       */
      waitForOrderModal(): Chainable<void>;
      
      /**
       * Close modal by clicking close button
       * @example cy.closeModal()
       */
      closeModal(): Chainable<void>;
    }
  }
}


Cypress.Commands.add('dragAndDrop', (source: string | Cypress.Chainable, target: string | Cypress.Chainable) => {
  const sourceElement = typeof source === 'string' ? cy.get(source) : source;
  const targetElement = typeof target === 'string' ? cy.get(target) : target;
  
  sourceElement.trigger('dragstart', { dataTransfer: new DataTransfer() });
  targetElement.trigger('dragover').trigger('drop');
});


Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});


Cypress.Commands.add('clickTab', (tabName: string) => {
  // Проверяем, активна ли вкладка, и скроллим к соответствующей секции
  cy.contains(tabName).then(($tab) => {
    const tabText = tabName;
    let sectionId = '';
    
    if (tabText === SELECTORS.BUNS_TAB) {
      sectionId = '#section-buns';
    } else if (tabText === SELECTORS.SAUCES_TAB) {
      sectionId = '#section-sauces';
    } else if (tabText === SELECTORS.MAINS_TAB) {
      sectionId = '#section-mains';
    }
    
    if (sectionId) {
      // Скроллим к секции вместо клика по вкладке
      cy.get(sectionId).scrollIntoView();
      cy.wait(300); // Ждем обновления активной вкладки
    } else {
      // Если не нашли секцию, пробуем кликнуть, но с force если нужно
      cy.contains(tabName).click({ force: true });
    }
  });
});


Cypress.Commands.add('addBunToConstructor', () => {
  // Получаем доступ к Redux store и напрямую диспатчим actions
  cy.window().its('__REDUX_STORE__').then((store) => {
    const state = store.getState();
    const ingredients = state.ingredients.items;
    const bun = ingredients.find((ing: any) => ing.type === 'bun');
    
    if (bun) {
      // Диспатчим actions для добавления булки
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
  
  // Ждем обновления компонента после диспатча
  cy.wait(500);
});


Cypress.Commands.add('addFillingToConstructor', (tabName: string) => {
  // Получаем доступ к Redux store и напрямую диспатчим actions
  cy.window().its('__REDUX_STORE__').then((store) => {
    const state = store.getState();
    const ingredients = state.ingredients.items;
    
    // Определяем тип ингредиента по названию вкладки
    let ingredientType = '';
    if (tabName === SELECTORS.SAUCES_TAB) {
      ingredientType = 'sauce';
    } else if (tabName === SELECTORS.MAINS_TAB) {
      ingredientType = 'main';
    }
    
    // Находим первый ингредиент нужного типа
    const filling = ingredients.find((ing: any) => ing.type === ingredientType);
    
    if (filling) {
      // Генерируем UUID для начинки (как в action используется uuidv4)
      // Используем простую генерацию для тестов
      const uuid = `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Диспатчим actions для добавления начинки
      store.dispatch({
        type: 'ADD_INGREDIENT_TO_CONSTRUCTOR',
        payload: { ...filling, uuid },
      });
      store.dispatch({
        type: 'INCREMENT_INGREDIENT_COUNT',
        payload: { id: filling._id, amount: 1 },
      });
      
      // Ждем обновления компонента после диспатча
      cy.wait(100);
    }
  });
  
  // Проверяем, что элемент появился в конструкторе
  cy.get('[data-testid="constructor-filling"]', { timeout: 5000 }).should('exist');
});


Cypress.Commands.add('setupConstructorIntercepts', () => {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
});


Cypress.Commands.add('mockAuth', (token: string = 'mock-token') => {
  cy.window().then((win) => {
    // Устанавливаем токен в localStorage
    win.localStorage.setItem('accessToken', token);
    
    // Устанавливаем авторизацию в Redux state
    const store = (win as any).__REDUX_STORE__;
    if (store) {
      // Мокаем пользователя
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      
      // Устанавливаем авторизацию через action
      store.dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: mockUser,
          accessToken: token,
          refreshToken: 'mock-refresh-token',
        },
      });
    }
  });
});


Cypress.Commands.add('clearAuth', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
  });
});


Cypress.Commands.add('waitForOrderModal', () => {
  cy.contains(SELECTORS.ORDER_ID_LABEL, { timeout: 10000 }).scrollIntoView().should('be.visible');
  cy.contains(SELECTORS.ORDER_STATUS).scrollIntoView().should('be.visible');
});


Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.CLOSE_BUTTON).click();
});

export {};
