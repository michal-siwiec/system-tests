describe('Newsletter', () => {
  // TODO - After saving such user state inside Client panel should be updated automatically
  it.skip('shows whether user is saved to newsletter', () => {
    cy.visit('/');
    cy.goToRegisterPage();
    cy.registerUser();
    cy.goToClientPanel({ section: 'Newsletter' });

    cy.contains('Status: Niezapisany').should('be.visible');
    cy.contains('Aktualnie jesteś niezapisany na nasz budowlany newsletter').should('be.visible');
    cy.contains('(Zapisz się)').should('be.visible');

    cy.contains('(Zapisz się)').click();
    cy.saveUserToNewsletter();
  });
});
