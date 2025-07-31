describe('opinions', () => {
  describe("when user isn't logged", () => {
    beforeEach(() => {
      cy.trackRequest({ operationName: 'OpinionsDetails' });
      cy.visit('/opinions');
      cy.wait('@OpinionsDetails');
    });

    it('shows already added opinions', () => {
      cy.get('[data-testid="opinion-container"]').first()
        .within(() => {
          cy.contains('andrzej123@gmail.com');
          cy.get('span[aria-label="5 Stars"]').should('exist');
          cy.contains('Szeroki wybór oraz miła o...');
        });

      cy.get('[data-testid="opinion-container"]').eq(1)
        .within(() => {
          cy.contains('pawel123@gmail.com');
          cy.get('span[aria-label="4 Stars"]').should('exist');
          cy.contains('Szybka dostawa, polecam.');
        });
    });

    it("doesn't show form for adding opinion", () => {
      cy.contains('Dodaj opinie').should('not.exist');
    });
  });

  describe('when user is logged', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.login();
      cy.trackRequest({ operationName: 'OpinionsDetails' });
      cy.visit('/opinions');
      cy.wait('@OpinionsDetails');
    });

    it('shows already added opinions', () => {
      cy.get('[data-testid="opinion-container"]').first()
        .within(() => {
          cy.contains('andrzej123@gmail.com');
          cy.get('span[aria-label="5 Stars"]').should('exist');
          cy.contains('Szeroki wybór oraz miła o...');
        });

      cy.get('[data-testid="opinion-container"]').eq(1)
        .within(() => {
          cy.contains('pawel123@gmail.com');
          cy.get('span[aria-label="4 Stars"]').should('exist');
          cy.contains('Szybka dostawa, polecam.');
        });
    });

    it('shows form for adding opinion', () => {
      cy.contains('Dodaj opinie').should('exist');
      cy.contains('Wyślij').should('exist');
    });

    it('makes possible to add opinion', () => {
      const opinionContent = `Lorem ipsum ${Date.now()}`;

      cy.trackRequest({ operationName: 'addOpinion' });
      cy.get('[data-testid="opinion-textarea"]').type(opinionContent);
      cy.get('[data-testid="add-opinion-submit-button"]').click();
      cy.wait('@addOpinion');

      cy.contains('Dziękujemy!');
      cy.contains('Dziękujemy za dodanie opini!');
      cy.pressESC();
      cy.contains('»').click();

      cy.get('[data-testid="opinion-container"]')
        .contains(opinionContent)
        .parents('[data-testid="opinion-container"]')
        .within(() => {
          cy.get('span[aria-label="5 Stars"]').should('exist');
          cy.contains('pawel123@gmail.com');
        });
    });
  });
});
