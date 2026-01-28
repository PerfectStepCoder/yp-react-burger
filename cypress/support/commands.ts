/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to drag and drop an element
       * @example cy.dragAndDrop('[data-testid="ingredient"]', '[data-testid="constructor"]')
       */
      dragAndDrop(source: string, target: string): Chainable<void>;
      
      /**
       * Custom command to login user
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}

// Custom command for drag and drop
Cypress.Commands.add('dragAndDrop', (source: string, target: string) => {
  cy.get(source).trigger('dragstart', { dataTransfer: new DataTransfer() });
  cy.get(target).trigger('drop', { dataTransfer: new DataTransfer() });
});

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

export {};
