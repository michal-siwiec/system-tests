describe('newsletter', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('when user is not logged', () => {
    it('shows newsletter form and make possible to save user properly', () => {
      cy.contains('Zapisz się na newsletter aby być na bieżąco!').should('be.visible');
      cy.get('.newsletter .form-container__form').within(() => {
        cy.get('[placeholder="Imię"]').should('be.visible').and('have.value', '');
        cy.get('[placeholder="Nazwisko"]').should('be.visible').and('have.value', '');
        cy.get('[placeholder="Adres email"]').should('be.visible').and('have.value', '');
      });

      cy.saveUserToNewsletter({ fillEmail: true });

      cy.contains('Dziękujemy!').should('be.visible');
      cy.contains('Zostałeś zapisany na newsletter!').should('be.visible');

      cy.pressESC();

      cy.contains('Dziękujemy!').should('not.exist');
      cy.contains('Zostałeś zapisany na newsletter!').should('not.exist');
      cy.contains('Zapisz się na newsletter aby być na bieżąco!').should('be.visible');
      cy.get('.newsletter .form-container__form').within(() => {
        cy.get('[placeholder="Imię"]').should('be.visible').and('have.value', '');
        cy.get('[placeholder="Nazwisko"]').should('be.visible').and('have.value', '');
        cy.get('[placeholder="Adres email"]').should('be.visible').and('have.value', '');
      });
    });
  });

  describe('when user is logged', () => {
    it('shows newsletter form when user is not saved yet and make possible to save properly', () => {
      cy.goToRegisterPage();
      cy.registerUser().then(({ email }) => {
        cy.contains('Wyloguj').should('exist');

        cy.trackRequest({ operationName: 'User' });
        cy.wait('@User');

        cy.contains('Zapisz się na newsletter aby być na bieżąco!').should('be.visible');
        cy.get('.newsletter .form-container__form').within(() => {
          cy.get('[placeholder="Imię"]').should('be.visible').and('have.value', '');
          cy.get('[placeholder="Nazwisko"]').should('be.visible').and('have.value', '');
          cy.get('[placeholder="Adres email"]').should('be.visible').and('have.value', email);
        });

        cy.saveUserToNewsletter();

        cy.contains('Dziękujemy!').should('be.visible');
        cy.contains('Zostałeś zapisany na newsletter!').should('be.visible');

        cy.pressESC();

        cy.contains('Dziękujemy!').should('not.exist');
        cy.contains('Zostałeś zapisany na newsletter!').should('not.exist');
        cy.contains('Zapisz się na newsletter aby być na bieżąco!').should('not.exist');
      });
    });

    it("doesn't show newsletter form when user is saved already", () => {
      cy.goToRegisterPage();
      cy.registerUser().then(({ email, password }) => {
        cy.saveUserToNewsletter();

        cy.contains('Dziękujemy!').should('exist');
        cy.contains('Zostałeś zapisany na newsletter!').should('exist');

        cy.pressESC();;
        cy.logout();

        cy.contains('Zapisz się na newsletter aby być na bieżąco!').should('be.visible');

        cy.get('.newsletter .form-container__form').within(() => {
          cy.get('[placeholder="Imię"]').should('be.visible').and('have.value', '');
          cy.get('[placeholder="Nazwisko"]').should('be.visible').and('have.value', '');
          cy.get('[placeholder="Adres email"]').should('be.visible').and('have.value', '');
        });

        cy.goToLoginPage();
        cy.login({ email, password });

        cy.get('.newsletter').should('not.exist');
      });
    });

    // TODO: Form should be filled with proper client data from user panel - after update is should appear automatically
    // TODO: After saving to newsletter state inside newsletter client panel should be updated
    // TODO: After leaving newsletter from client panel layout should be updated as well
  });
});
