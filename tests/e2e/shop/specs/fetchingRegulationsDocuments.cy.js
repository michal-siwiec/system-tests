describe('fetching documents', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('fetches Polityka prywatności.pdf after click on this in footer', () => {
    cy.intercept('GET', '**/documents/polityka_prywatnosci.pdf').as('policyPrivacyRequest');
    cy.contains('Polityka prywatności').click();
    cy.wait('@policyPrivacyRequest');

    cy.readFile('tests/e2e/shop/downloads/Polityka prywatności.pdf', 'binary').should('exist');
  });

  it('fetches Regulamin sklepu.pdf after click on this in footer', () => {
    cy.intercept('GET', '**/documents/regulamin_sklepu.pdf').as('shopRulesRequest');
    cy.contains('Regulamin sklepu').click();
    cy.wait('@shopRulesRequest');

    cy.readFile('tests/e2e/shop/downloads/Regulamin sklepu.pdf', 'binary').should('exist');
  });
});
