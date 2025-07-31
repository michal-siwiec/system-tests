describe('404 page', () => {
  beforeEach(() => {
    cy.visit('/asdasdasd');
  });

  it('renders proper 404 page', () => {
    cy.contains('404').should('be.visible');
    cy.contains('Wygląda na to, że szukana przez Ciebie strona nie istnieje!').should('be.visible');
    cy.contains('Za chwilę zostaniesz przekierowany na stronę główną').should('be.visible');
  });

  it('redirects to main page after 5s', () => {
    cy.url({ timeout: 6000 }).should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Polecane produkty').should('be.visible');
  });
});
