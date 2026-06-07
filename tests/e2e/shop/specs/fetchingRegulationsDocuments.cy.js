describe('fetching documents', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('fetches Polityka prywatności.pdf after click on this in footer', () => {
    cy.contains('Polityka prywatności').trigger('mousedown');

    cy.get('@windowOpen').should('have.been.calledOnce');
    cy.get('@windowOpen').its('firstCall.args.0').should('include', 'documents/polityka_prywatnosci.pdf');
  });

  it('fetches Regulamin sklepu.pdf after click on this in footer', () => {
    cy.contains('Regulamin sklepu').trigger('mousedown');

    cy.get('@windowOpen').should('have.been.calledOnce');
    cy.get('@windowOpen').its('firstCall.args.0').should('include', 'documents/regulamin_sklepu.pdf');
  });
});
