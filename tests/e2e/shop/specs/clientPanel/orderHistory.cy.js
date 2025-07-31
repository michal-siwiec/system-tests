describe('Order history', () => {
  it("shows user's orders", () => {
    cy.visit('/');
    cy.goToLoginPage();
    cy.login();
    cy.contains('Strefa dachu').click();
    cy.addProductToBasket({ productName: 'Mocownik łaty kominiarskiej', quantity: '2' });
    cy.addProductToBasket({ productName: 'Kratka zabezpieczająca przed ptactwem', quantity: '5' });
    cy.goToBasket()
    cy.contains('Kontynuuj zakupy').click();
    cy.fillFirstOrderStep();
    cy.contains('Dalej').click();
    cy.contains('Dalej').click();
    cy.contains('Dalej').click();

    cy.trackRequest({ operationName: 'addOrder' });
    cy.contains('Kupuje i płacę').click();
    cy.wait('@addOrder');

    cy.logout();

    cy.goToRegisterPage();
    cy.registerUser();
    cy.goToClientPanel({ section: 'Historia' });

    cy.get('table.history__table tr').should('have.length', 1);

    cy.get("table.history__table tr").eq(0).within(() => {
      cy.contains('Numer zamówienia').should('be.visible');
      cy.contains('Cena całkowita').should('be.visible');
      cy.contains('Data zakupu').should('be.visible');
    });

    cy.contains('Chemia budowlana').click();
    cy.addProductToBasket({ productName: 'Tynk nanosilikonowy', quantity: '2' });
    cy.addProductToBasket({ productName: 'Klej do styropianu', quantity: '1' });
    cy.addProductToBasket({ productName: 'Klej do dociepleń', quantity: '3' });
    cy.goToBasket()
    cy.contains('Kontynuuj zakupy').click();
    cy.fillFirstOrderStep();
    cy.contains('Dalej').click();
    cy.contains('Dalej').click();
    cy.contains('Dalej').click();

    cy.trackRequest({ operationName: 'addOrder' });
    cy.contains('Kupuje i płacę').click();
    cy.wait('@addOrder');

    cy.goToClientPanel({ section: 'Historia' });

    cy.get('table.history__table tr').should('have.length', 2);

    cy.get("table.history__table tr").eq(0).within(() => {
      cy.contains('Numer zamówienia').should('be.visible');
      cy.contains('Cena całkowita').should('be.visible');
      cy.contains('Data zakupu').should('be.visible');
    });

    cy.get("table.history__table tr").eq(1).within(() => {
      cy.contains(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i).should('be.visible');
      cy.contains('776.93 zł').should('be.visible');
      cy.contains(/\d{1,2}\/\d{1,2}\/\d{4}/).should('be.visible');
    });
  });
});
