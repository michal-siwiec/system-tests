describe('Client details', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.goToRegisterPage();
    cy.registerUser();
    cy.goToClientPanel();
  });

  it('shows empty client details for new client', () => {
    cy.get('.my-details').within(() => {
      cy.get('[placeholder="Imię"]').should('have.value', '');
      cy.get('[placeholder="Nazwisko"]').should('have.value', '');
      cy.get('[placeholder="Numer telefonu"]').should('have.value', '');
      cy.get('[placeholder="Miasto"]').should('have.value', '');
      cy.get('[placeholder="Kod pocztowy"]').should('have.value', '');
      cy.get('[placeholder="Ulica"]').should('have.value', '');
    });
  });

  it('updates successfully client details', () => {
    cy.trackRequest({ operationName: 'updateUserDetails' });

    cy.get('.my-details').within(() => {
      cy.get('[placeholder="Imię"]').type('Michal');
      cy.get('[placeholder="Nazwisko"]').type('Siwiec');
      cy.get('[placeholder="Numer telefonu"]').type('724131140');
      cy.get('[placeholder="Miasto"]').type('Gliwice');
      cy.get('[placeholder="Kod pocztowy"]').type('44-100');
      cy.get('[placeholder="Ulica"]').type('Tadeusza Gruszczynskiego');
      cy.contains('Aktualizuj dane osobowe').click();
    });

    cy.wait('@updateUserDetails');

    cy.pressESC();
    cy.goToPromotedProductsPage();
    cy.goToClientPanel();

    cy.get('.my-details').within(() => {
    cy.get('[placeholder="Imię"]').should('have.value', 'Michal');
    cy.get('[placeholder="Nazwisko"]').should('have.value', 'Siwiec');
    cy.get('[placeholder="Numer telefonu"]').should('have.value', '724131140');
    cy.get('[placeholder="Miasto"]').should('have.value', 'Gliwice');
    cy.get('[placeholder="Kod pocztowy"]').should('have.value', '44-100');
    cy.get('[placeholder="Ulica"]').should('have.value', 'Tadeusza Gruszczynskiego');
    });
  });
});
