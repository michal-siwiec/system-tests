describe('Changing password', () => {
  it('changes password successfully', () => {
    const newPassword = 'qwertY123';

    cy.visit('/');
    cy.goToRegisterPage();
    cy.registerUser().then(({ email, password }) => {
      cy.logout();
      cy.goToLoginPage();
      cy.login({ email, password });
      cy.goToClientPanel({ section: 'Zmień hasło' });

      cy.trackRequest({ operationName: 'changeUserPassword' });
      cy.get('[placeholder="Nowe hasło"]').type(newPassword);
      cy.get('[placeholder="Potwierdź nowe hasło"]').type(newPassword);
      cy.contains('Zapisz').click();
      cy.wait('@changeUserPassword');

      cy.contains('Dziękujemy!').should('be.visible');
      cy.contains('Hasło zostało zmienione!').should('be.visible');

      cy.pressESC();

      cy.contains('Dziękujemy!').should('not.exist');
      cy.contains('Hasło zostało zmienione!').should('not.exist');

      cy.logout();

      cy.goToLoginPage();
      cy.login({ email, password });

      cy.contains('Wystąpił niespodziewany problem!').should('be.visible');
      cy.contains('Niepoprawne hasło!').should('be.visible');
      cy.contains('Za utrudnienia przepraszamy').should('be.visible');

      cy.pressESC();

      cy.contains('Wystąpił niespodziewany problem!').should('not.exist');
      cy.contains('Niepoprawne hasło!').should('not.exist');
      cy.contains('Za utrudnienia przepraszamy').should('not.exist');

      cy.login({ email, password: newPassword });
      cy.contains('Wyloguj').should('be.visible');
    });
  });
});
