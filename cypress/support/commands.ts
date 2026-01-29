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
  cy.contains(tabName).click();
});


Cypress.Commands.add('addBunToConstructor', () => {
  cy.clickTab(SELECTORS.BUNS_TAB);
  cy.get(SELECTORS.INGREDIENT_CARD).first().trigger('dragstart', { dataTransfer: new DataTransfer() });
  cy.contains(SELECTORS.BUN_DROP_ZONE).trigger('dragover').trigger('drop');
  cy.contains(SELECTORS.BUN_TOP, { timeout: 5000 }).should('be.visible');
});


Cypress.Commands.add('addFillingToConstructor', (tabName: string) => {
  cy.clickTab(tabName);
  cy.get(SELECTORS.INGREDIENT_CARD).first().trigger('dragstart', { dataTransfer: new DataTransfer() });
  cy.contains(SELECTORS.FILLING_DROP_ZONE).trigger('dragover').trigger('drop');
});


Cypress.Commands.add('setupConstructorIntercepts', () => {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
});


Cypress.Commands.add('mockAuth', (token: string = 'mock-token') => {
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', token);
  });
});


Cypress.Commands.add('clearAuth', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
  });
});


Cypress.Commands.add('waitForOrderModal', () => {
  cy.contains(SELECTORS.ORDER_ID_LABEL, { timeout: 10000 }).should('be.visible');
  cy.contains(SELECTORS.ORDER_STATUS).should('be.visible');
});


Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.CLOSE_BUTTON).click();
});

export {};
