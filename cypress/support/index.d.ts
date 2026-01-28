/// <reference types="cypress" />

declare namespace Cypress {
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
