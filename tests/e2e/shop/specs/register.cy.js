describe('Register flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('registers user successfully', () => {
    cy.contains('Rejestracja').should('exist');
    cy.contains('Wyloguj').should('not.exist');

    cy.registerUser().then(({ email }) => {
      cy.contains('Rejestracja').should('not.exist');
      cy.contains('Wyloguj').should('exist');

      cy.logout();
      cy.goToLoginPage();
      cy.login({ email, password: 'qwertY12' });

      cy.contains('Rejestracja').should('not.exist');
      cy.contains('Wyloguj').should('exist');
    });
  });

  it("doesn't register user when user with the same email already exist", () => {
    cy.registerUser({ email: 'pawel123@gmail.com' });

    cy.contains('Wystąpił niespodziewany problem!').should('exist');
    cy.contains('Adres email jest już zajęty!').should('exist');
    cy.contains('Rejestracja').should('exist');
    cy.contains('Wyloguj').should('not.exist');
  });

  it('register to / page when user is already logged', () => {
    cy.registerUser();

    cy.location('pathname').should('eq', '/');
    cy.contains('Wyloguj').should('exist');
    cy.contains('Rejestracja').should('not.exist');
  });
});
