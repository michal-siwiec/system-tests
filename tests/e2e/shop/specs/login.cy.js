const assertLoggedOutUI = () => {
  cy.contains('Logowanie').should('exist');
  cy.contains('Wyloguj').should('not.exist');
};

const assertLoggedInUI = () => {
  cy.contains('Logowanie').should('not.exist');
  cy.contains('Wyloguj').should('exist');
};

describe('Login flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('login user successfully if user exists', () => {
    assertLoggedOutUI();

    cy.login();

    assertLoggedInUI();
  });

  it("doesn't login user if user doesn't exist", () => {
    assertLoggedOutUI();

    cy.login({ email: 'pawel12377777@gmail.com' });

    assertLoggedOutUI();
    cy.contains('Użytkownik o takim adresie email nie istnieje!').should('exist');
  });

  it("doesn't login user if password is not correct", () => {
    assertLoggedOutUI();

    cy.login({ password: '1234Hbjkajjkkaasd11111' });

    assertLoggedOutUI();
    cy.contains('Niepoprawne hasło!').should('exist');
  });

  it('redirects to main page when user try to visit /login but is already logged', () => {
    cy.login();
    cy.visit('/login');

    cy.location('pathname').should('eq', '/');
    assertLoggedInUI();
  });
});
