/// <reference types="cypress" />

declare namespace Cypress {
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
