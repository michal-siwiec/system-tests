describe('Order finalization', () => {
  const orderId = 'da97aa73-f0e4-4a17-9157-9f17454c73f3';
  const paymentId = 'c79576b2-702f-4259-bc20-ab5aa6ea3dac';

  describe('success path', () => {
    beforeEach(() => {
      cy.submitOrder();
      cy.mockRequest({
        operationName: 'Order',
        aliasName: 'getOrder',
        responseData: {
          order: {
            paid: true,
            latestPayment: {
              id: paymentId,
              status: 'succeeded',
              amountCents: 13698,
              provider: 'stripe'
            }
          }
        }
      });
    });

    it('renders paid payment summary', () => {
      cy.visit(`/thank-you-page?order_id=${orderId}`);
      cy.wait('@getOrder');

      cy.contains('Dziękujemy za dokonanie zakupu!').should('be.visible');
      cy.contains('Płatność została opłacona.').should('be.visible');
      cy.contains('STRIPE').should('be.visible');
      cy.contains('Opłacono').should('be.visible');
      cy.contains('136.98 zł').should('be.visible');
      cy.contains('Pobierz fakturę w formacie PDF').should('be.visible');
    });

    it('downloads invoice after clicking button', () => {
      cy.visit(`/thank-you-page?order_id=${orderId}`);
      cy.wait('@getOrder');

      cy.intercept('GET', '**/users/**/invoices/**.pdf').as('getInvoiceRequest');
      cy.contains('Pobierz fakturę w formacie PDF').click();
      cy.wait('@getInvoiceRequest').then(({ request }) => {
        const url = request.url;
        const match = url.match(/invoices\/([a-f0-9\-]+)\.pdf$/);
        const invoiceId = match[1];

        cy.readFile(`tests/e2e/shop/downloads/Faktura za zamówienie_ ${invoiceId}.pdf`, 'binary').should('exist');
      });
    });
  });

  describe('failure path', () => {
    describe('expired status', () => {
      beforeEach(() => {
        cy.submitOrder();
        cy.mockRequest({
          operationName: 'Order',
          aliasName: 'getOrder',
          responseData: {
            order: {
              paid: false,
              latestPayment: {
                id: paymentId,
                status: 'expired',
                amountCents: 13698,
                provider: 'stripe'
              }
            }
          }
        });
      });

      it('renders failed payment summary for expired status', () => {
        cy.visit(`/thank-you-page?order_id=${orderId}`);
        cy.wait('@getOrder');

        cy.contains('Niestety płatność nie została zrealizowana.').should('be.visible');
        cy.contains('Wygasło').should('be.visible');
        cy.contains('ID płatności').should('be.visible');
        cy.contains(paymentId).should('be.visible');
        cy.contains('Kontakt').should('be.visible');
        cy.contains('724 131 140').should('be.visible');
        cy.contains('siwiec.michal724@gmail.com').should('be.visible');
        cy.contains('Pobierz fakturę w formacie PDF').should('not.exist');
      });
    });

    describe('failed status', () => {
      beforeEach(() => {
        cy.submitOrder();
        cy.mockRequest({
          operationName: 'Order',
          aliasName: 'getOrder',
          responseData: {
            order: {
              paid: false,
              latestPayment: {
                id: paymentId,
                status: 'failed',
                amountCents: 13698,
                provider: 'stripe'
              }
            }
          }
        });
      });

      it('renders failed payment summary for failed status', () => {
        cy.visit(`/thank-you-page?order_id=${orderId}`);
        cy.wait('@getOrder');

        cy.contains('Niestety płatność nie została zrealizowana.').should('be.visible');
        cy.contains('Nieopłacono').should('be.visible');
        cy.contains('ID płatności').should('be.visible');
        cy.contains(paymentId).should('be.visible');
        cy.contains('Kontakt').should('be.visible');
        cy.contains('724 131 140').should('be.visible');
        cy.contains('siwiec.michal724@gmail.com').should('be.visible');
        cy.contains('Pobierz fakturę w formacie PDF').should('not.exist');
      });
    });
  });
});
