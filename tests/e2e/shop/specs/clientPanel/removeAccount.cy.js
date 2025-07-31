describe('removing account', () => {
  it('remove account successfully', () => {
    cy.visit('/');
    cy.goToRegisterPage();
    cy.registerUser().then(({ email, password }) => {
      cy.logout();
      cy.goToLoginPage();
      cy.login({ email, password });
      
      cy.goToClientPanel({ section: 'Usuń konto' });
      cy.trackRequest({ operationName: 'removeAccount' });
      cy.contains('Usuń konto!').click();
      cy.wait('@removeAccount');

      cy.contains('Dziękujemy!').should('be.visible');
      cy.contains('Twoje konto zostało pomyślnie usunięte!').should('be.visible');

      cy.pressESC();

      cy.contains('Dziękujemy!').should('not.exist');
      cy.contains('Twoje konto zostało pomyślnie usunięte!').should('not.exist');
      cy.contains('Logowanie').should('be.visible');

      cy.goToLoginPage();
      cy.login({ email, password });

      cy.contains('Wystąpił niespodziewany problem!').should('be.visible');
      cy.contains('Użytkownik o takim adresie email nie istnieje!').should('be.visible');
      cy.contains('Za utrudnienia przepraszamy').should('be.visible');

      cy.pressESC();

      cy.contains('Wystąpił niespodziewany problem!').should('not.exist');
      cy.contains('Użytkownik o takim adresie email nie istnieje!').should('not.exist');
      cy.contains('Za utrudnienia przepraszamy').should('not.exist');
    });
  });  
});
