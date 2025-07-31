Cypress.Commands.add('login', ({ email = 'pawel123@gmail.com', password = '1234Hbjkajjkkaasd' } = {}) => {
  cy.trackRequest({ operationName: 'loginUser' });

  cy.get('.login').within(() => {
    cy.get('[placeholder="Adres email"]').clear().type(email);
    cy.get('[placeholder="Hasło"]').clear().type(password);
    cy.contains('Zaloguj się').click();
  });
  
  cy.wait('@loginUser');
});

Cypress.Commands.add('logout', () => {
  cy.trackRequest({ operationName: 'logoutUser' });
  cy.contains('Wyloguj').click();
  cy.wait('@logoutUser');
});

Cypress.Commands.add('registerUser', ({ email = `siwiec.michal${Date.now()}@gmail.com`, password = 'qwertY12' } = {}) => {
  cy.trackRequest({ operationName: 'registerUser' });
  cy.get('[data-testid="register-email-input"]').type(email);
  cy.get('[data-testid="register-password-input"]').type(password);
  cy.get('[data-testid="register-submit-button"]').click();
  cy.wait('@registerUser');

  cy.wrap({ email, password }); 
});

Cypress.Commands.add('addProductToBasket', ({ productName, quantity }) => {
  cy.get('[data-testid="product-container"]').each(($el) => {
      const productName_ = $el.find('.product__name').text().trim();

      if (productName_ === productName) {
        cy.wrap($el).within(() => {
          cy.get('input[type="number"]').type('{selectall}').type(quantity);
          cy.contains('Dodaj do koszyka').click();
        });
      }
    });
});

Cypress.Commands.add('saveUserToNewsletter', ({ fillEmail = false } = {}) => {
  cy.trackRequest({ operationName: 'subscribeUserToNewsletter' });
  
  cy.get('.newsletter .form-container__form').within(() => {
    cy.get('[placeholder="Imię"]').clear().type('Michal');
    cy.get('[placeholder="Nazwisko"]').clear().type('Siwiec');
    if (fillEmail) cy.get('[placeholder="Adres email"]').clear().type(`siwiec.michal${Date.now()}@gmail.com`);
    cy.contains('Zapisz').click();
  });

  cy.wait('@subscribeUserToNewsletter');
});

Cypress.Commands.add('fillFirstOrderStep', () => {
  cy.get('.form-container.order').within(() => {
    cy.get('[placeholder="Imię"]').clear().type('Michal');
    cy.get('[placeholder="Nazwisko"]').clear().type('Siwiec');
    cy.get('[placeholder="Ulica"]').clear().type('Tadeusza Gruszczynskiego');
    cy.get('[placeholder="Miasto"]').clear().type('Gliwice');
    cy.get('[placeholder="Kod pocztowy"]').clear().type('44-100');
    cy.get('[placeholder="Adres email"]').clear().type('siwiec.michal724@gmail.com');
    cy.get('[placeholder="Numer telefonu"]').clear().type('724131140');
  });
});

Cypress.Commands.add('goToPromotedProductsPage', () => {
  cy.get('img[alt="Budoman logo"]').click();
});

Cypress.Commands.add('goToBasket', () => {
  cy.get('[data-testid="basket-icon"]').click();
});

Cypress.Commands.add('goToLoginPage', () => {
  cy.contains('Logowanie').click();
});

Cypress.Commands.add('goToRegisterPage', () => {
  cy.contains('Rejestracja').click();
});

Cypress.Commands.add('goToClientPanel', ({ section } = {}) => {
  cy.get('img[alt="avatar"]').click();

  if (section) {
    cy.get('.user-panel').within(() => {
      cy.contains(section).click();
    });
  }
});

Cypress.Commands.add('pressESC', () => {
  cy.get('body').type('{esc}');
});

Cypress.Commands.add('trackRequest', ({ operationName, aliasName = operationName } = {}) => {
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === operationName) {
      req.alias = aliasName;
    }
  });
});
