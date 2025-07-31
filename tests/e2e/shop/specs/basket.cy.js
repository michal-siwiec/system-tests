describe('Basket', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows empty basket', () => {
    cy.contains('0.00 zł').should('be.visible');

    cy.goToBasket()

    cy.contains('Twój koszyk jest pusty!').should('be.visible');
    cy.contains('Dodaj swój pierwszy produkt!').should('be.visible');

    cy.contains('Dodaj swój pierwszy produkt!').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Polecane produkty').should('be.visible');
  });

  it('shows added products to basket', () => {
    cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '5' });

    cy.contains('604.95 zł').should('be.visible');

    cy.goToBasket()

    cy.contains('Twój koszyk').should('be.visible');
    cy.get('.product--basket').within(() => {
      cy.contains('Tynk akrylowy').should('be.visible');
      cy.contains('120,99 zł').should('be.visible');
      cy.get('input[type="number"]').should('have.value', '5').and('be.disabled');
    });
  });

  it('increases product quantity in basket when product is already added', () => {
    cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
    cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '2' });

    cy.contains('362.97 zł').should('be.visible');

    cy.goToBasket()
    
    cy.contains('Twój koszyk').should('be.visible');
    cy.get('.product--basket').within(() => {
      cy.contains('Tynk akrylowy').should('be.visible');
      cy.contains('120,99 zł').should('be.visible');
      cy.get('input[type="number"]').should('have.value', '3').and('be.disabled');
    });
  });

  it('adds new product when product is not added yet', () => {
    cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
    cy.addProductToBasket({ productName: 'Grunt głęboko penetrujący', quantity: '4' });

    cy.contains('820.95 zł').should('be.visible');

    cy.goToBasket()

    cy.contains('Twój koszyk').should('be.visible');

    cy.get('.product--basket').eq(0).within(() => {
      cy.contains('Tynk akrylowy').should('be.visible');
      cy.contains('120,99 zł').should('be.visible');
      cy.get('input[type="number"]').should('have.value', '1').and('be.disabled');
    });

    cy.get('.product--basket').eq(1).scrollIntoView();

    cy.get('.product--basket').eq(1).within(() => {
      cy.contains('Grunt głęboko penetrujący').should('be.visible');
      cy.contains('174,99 zł').should('be.visible');
      cy.get('input[type="number"]').should('have.value', '4').and('be.disabled');
    });
  });

  it("redirects to order page after click in 'Kontynuuj zakupy'", () => {
    cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
    cy.goToBasket()
    cy.contains('Kontynuuj zakupy').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/order');
  });
});
