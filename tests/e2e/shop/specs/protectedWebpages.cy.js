describe('Protected webpages', () => {
  describe('sidekiq panel', () => {
    it('locks access to Sidekiq panel', () => {
      cy.request({ url: `${Cypress.config('apiUrl')}/sidekiq`, failOnStatusCode: false })
        .then((response) => {
          expect(response.status).to.eq(401);
        });
    });

    it('locks access to Sidekiq panel when data are not correct', () => {
      cy.request({ url: `${Cypress.config('apiUrl')}/sidekiq`, failOnStatusCode: false, auth: { username: 'Andrzej', password: '1234' } })
        .then((response) => {
          expect(response.status).to.eq(401);
        });
    });

    Cypress.env('CI') ? (
      it('allows to visit page when auth data are correct', () => {
        cy.request({
          url: `${Cypress.config('apiUrl')}/sidekiq`,
          failOnStatusCode: false,
          auth: { username: Cypress.env('sidekiqPanelLogin'), password: Cypress.env('sidekiqPanelPassword') }
        })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      })
    ) : null
  });
});
