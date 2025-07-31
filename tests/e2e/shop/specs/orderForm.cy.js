describe('Order form', () => {
  describe('first step', () => {
    let shouldBeLogged = false;
    let shouldUpdateUserDetails = false;
    let userLoginCredentials = { email: 'pawel123@gmail.com', password: '1234Hbjkajjkkaasd' };

    beforeEach(() => {
      cy.visit('/');

      if (shouldBeLogged) {
        cy.goToLoginPage();
        cy.login(userLoginCredentials);
      }

      if (shouldUpdateUserDetails) {
        cy.goToClientPanel();

        cy.trackRequest({ operationName: 'updateUserDetails' });
        cy.get('.my-details').within(() => {
          cy.get('[placeholder="Imię"]').clear().type('Michal');
          cy.get('[placeholder="Nazwisko"]').clear().type('Siwiec');
          cy.get('[placeholder="Numer telefonu"]').clear().type('724131140');
          cy.get('[placeholder="Miasto"]').clear().type('Gliwice');
          cy.get('[placeholder="Kod pocztowy"]').clear().type('44-100');
          cy.get('[placeholder="Ulica"]').clear().type('Tadeusza Gruszczynskiego');
          cy.contains('Aktualizuj dane osobowe').click();
        });

        cy.wait('@updateUserDetails');
        cy.pressESC();
        cy.goToPromotedProductsPage();
      }

      cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
      cy.addProductToBasket({ productName: 'Grunt głęboko penetrujący', quantity: '4' });
      cy.goToBasket()
      cy.contains('Kontynuuj zakupy').click();
    });

    afterEach(() => {
      shouldBeLogged = false;
      shouldUpdateUserDetails = false;
      userLoginCredentials = { email: 'pawel123@gmail.com', password: '1234Hbjkajjkkaasd' };
    });

    describe('when user is not logged', () => {
      it('shows empty first step', () => {
        cy.get('.form-container.order').within(() => {
          cy.get('[placeholder="Imię"]').should('have.value', '');
          cy.get('[placeholder="Nazwisko"]').should('have.value', '');
          cy.get('[placeholder="Ulica"]').should('have.value', '');
          cy.get('[placeholder="Miasto"]').should('have.value', '');
          cy.get('[placeholder="Kod pocztowy"]').should('have.value', '');
          cy.get('[placeholder="Adres email"]').should('have.value', '');
          cy.get('[placeholder="Numer telefonu"]').should('have.value', '');
          cy.contains('Inpost (10,99 zł)').should('not.exist');
        });
      });
    });

    describe('when user is logged', () => {
      before(() => {
        shouldBeLogged = true;
      });

      it('shows empty first step when details are not configured in client panel', () => {
        cy.get('.form-container.order').within(() => {
          cy.get('[placeholder="Imię"]').should('have.value', '');
          cy.get('[placeholder="Nazwisko"]').should('have.value', '');
          cy.get('[placeholder="Ulica"]').should('have.value', '');
          cy.get('[placeholder="Miasto"]').should('have.value', '');
          cy.get('[placeholder="Kod pocztowy"]').should('have.value', '');
          cy.get('[placeholder="Adres email"]').should('have.value', 'pawel123@gmail.com');
          cy.get('[placeholder="Numer telefonu"]').should('have.value', '');
        });
      });

      describe('when user details are configured in client panel', () => {
        before(() => {
          shouldBeLogged = true;
          userLoginCredentials = { email: 'andrzej123@gmail.com', password: '1234Hbjkadasd' };
          shouldUpdateUserDetails = true;
        });

        it('shows already filled first step', () => {
          cy.get('[placeholder="Imię"]').should('have.value', 'Michal');
          cy.get('[placeholder="Nazwisko"]').should('have.value', 'Siwiec');
          cy.get('[placeholder="Ulica"]').should('have.value', 'Tadeusza Gruszczynskiego');
          cy.get('[placeholder="Miasto"]').should('have.value', 'Gliwice');
          cy.get('[placeholder="Kod pocztowy"]').should('have.value', '44-100');
          cy.get('[placeholder="Adres email"]').should('have.value', 'andrzej123@gmail.com');
          cy.get('[placeholder="Numer telefonu"]').should('have.value', '724131140');
        });
      });
    });

    it('validates entered data and pass to next step', () => {
      cy.contains('Imię ma niepoprawny format!').should('not.exist');
      cy.contains('Nazwisko ma niepoprawny format!').should('not.exist');
      cy.contains('Ulica ma niepoprawny format!').should('not.exist');
      cy.contains('Miasto ma niepoprawny format!').should('not.exist');
      cy.contains('Kod pocztowy ma niepoprawny format!').should('not.exist');
      cy.contains('Email ma niepoprawny format!').should('not.exist');
      cy.contains('Telefon ma niepoprawny format!').should('not.exist');

      cy.contains('Dalej').click();

      cy.contains('Imię ma niepoprawny format!').should('be.visible');
      cy.contains('Nazwisko ma niepoprawny format!').should('be.visible');
      cy.contains('Ulica ma niepoprawny format!').should('be.visible');
      cy.contains('Miasto ma niepoprawny format!').should('be.visible');
      cy.contains('Kod pocztowy ma niepoprawny format!').should('be.visible');
      cy.contains('Email ma niepoprawny format!').should('be.visible');
      cy.contains('Telefon ma niepoprawny format!').should('be.visible');

      cy.fillFirstOrderStep();
      cy.contains('Dalej').click();

      cy.get('.form-container.order').within(() => {
        cy.get('[placeholder="Imię"]').should('not.exist');
        cy.get('[placeholder="Nazwisko"]').should('not.exist');
        cy.get('[placeholder="Ulica"]').should('not.exist');
        cy.get('[placeholder="Miasto"]').should('not.exist');
        cy.get('[placeholder="Kod pocztowy"]').should('not.exist');
        cy.get('[placeholder="Adres email"]').should('not.exist');
        cy.get('[placeholder="Numer telefonu"]').should('not.exist');
        cy.contains('Inpost (10,99 zł)').should('be.visible');
      });
    });
  });

  describe('second step', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.login({ email: 'andrzej123@gmail.com', password: '1234Hbjkadasd' });
      cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
      cy.addProductToBasket({ productName: 'Grunt głęboko penetrujący', quantity: '4' });
      cy.goToBasket()
      cy.contains('Kontynuuj zakupy').click();
      cy.contains('Dalej').click();
    });

    it('renders proper content and selects DPD option', () => {
      cy.contains('Inpost (10,99 zł)').should('exist');
      cy.contains('DPD (15,99 zł)').should('exist');
      cy.contains('Odbiór w punkcie (0,00 zł)').should('exist');

      cy.get('[data-testid="inpost-checkbox"]').should('be.checked');
      cy.get('[data-testid="dpd-checkbox"]').should('not.be.checked');
      cy.get('[data-testid="pickup-at-the-point-checkbox"]').should('not.be.checked');

      cy.get('[data-testid="dpd-checkbox"]').check();

      cy.get('[data-testid="inpost-checkbox"]').should('not.be.checked');
      cy.get('[data-testid="dpd-checkbox"]').should('be.checked');
      cy.get('[data-testid="pickup-at-the-point-checkbox"]').should('not.be.checked');
    });
  });

  describe('third step', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.login({ email: 'andrzej123@gmail.com', password: '1234Hbjkadasd' });
      cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
      cy.addProductToBasket({ productName: 'Grunt głęboko penetrujący', quantity: '4' });
      cy.goToBasket()
      cy.contains('Kontynuuj zakupy').click();
      cy.contains('Dalej').click();
      cy.contains('Dalej').click();
    });

    it('renders proper content and selects traditional transfer option', () => {
      cy.contains('Płatność przy odbiorze').should('exist');
      cy.contains('Przelew tradycyjny').should('exist');

      cy.get('[data-testid="payment-on-delivery-checkbox"]').should('not.be.checked');
      cy.get('[data-testid="traditional-transfer-checkbox"]').should('be.checked');

      cy.get('[data-testid="payment-on-delivery-checkbox"]').check();

      cy.get('[data-testid="payment-on-delivery-checkbox"]').should('be.checked');
      cy.get('[data-testid="traditional-transfer-checkbox"]').should('not.be.checked');
    });
  });

  describe('fourth step', () => {
    let changePaymentMethodToPaymentOnDelivery = false;

    beforeEach(() => {
      cy.visit('/login');
      cy.login({ email: 'andrzej123@gmail.com', password: '1234Hbjkadasd' });
      cy.addProductToBasket({ productName: 'Tynk akrylowy', quantity: '1' });
      cy.addProductToBasket({ productName: 'Grunt głęboko penetrujący', quantity: '4' });
      cy.goToBasket()
      cy.contains('Kontynuuj zakupy').click();
      cy.contains('Dalej').click();
      cy.contains('Dalej').click();

      if (changePaymentMethodToPaymentOnDelivery) {
        cy.get('[data-testid="payment-on-delivery-checkbox"]').check();
      };

      cy.contains('Dalej').click();
    });

    it('shows basket summary', () => {
      cy.get('.summary').within(() => {
        cy.get("tr.summary__row").eq(0).within(() => {
          cy.contains('Nazwa').should('be.visible');
          cy.contains('Cena').should('be.visible');
          cy.contains('Ilość').should('be.visible');
        });

        cy.get("tr.summary__row").eq(1).within(() => {
          cy.contains('Tynk akrylowy').should('be.visible');
          cy.contains('120.99 zł').should('be.visible');
          cy.contains('1').should('be.visible');
        });

        cy.get("tr.summary__row").eq(2).within(() => {
          cy.contains('Grunt głęboko penetrujący').should('be.visible');
          cy.contains('174.99 zł').should('be.visible');
          cy.contains('4').should('be.visible');
        });

        cy.get("tr.summary__row").eq(3).within(() => {
          cy.contains('Suma całkowita').should('be.visible');
          cy.contains('820.95 zł').should('be.visible');
        });
      });
    });

    describe('submitting order', () => {
      beforeEach(() => {
        cy.trackRequest({ operationName: 'addOrder' });
        cy.contains('Kupuje i płacę').click();
        cy.wait('@addOrder');
      });

      it('successfully creates order when payment way is traditional-transfer', () => {
        cy.contains('Dziękujemy za dokonanie zakupu!').should('be.visible');
        cy.contains('Pobierz fakturę w formacie PDF').should('be.visible');
        cy.contains('Prosimy o dokonanie płatności według poniszych danych').should('be.visible');

        cy.get('.thank-you-page__transfer-info-wrapper').within(() => {
          cy.get("li").eq(0).within(() => {
            cy.contains('Kwota do zapłaty:').should('be.visible');
            cy.contains('831.94 zł').should('be.visible');
          });

          cy.get("li").eq(1).within(() => {
            cy.contains('Numer konta:').should('be.visible');
            cy.contains('39 1240 6960 4539 1123 2002 9161').should('be.visible');
          });

          cy.get("li").eq(2).within(() => {
            cy.contains('Tytuł przelewu:').should('be.visible');
            cy.contains(/^Zamówienie [0-9a-f\-]{36} - Budoman$/i).should('be.visible');
          });

          cy.get("li").eq(3).within(() => {
            cy.contains('Nazwa odbiorcy:').should('be.visible');
            cy.contains('Budoman').should('be.visible');
          });

          cy.get("li").eq(4).within(() => {
            cy.contains('Adres odbiorcy:').should('be.visible');
            cy.contains('Żywiec 34-300, Beskidzka 50').should('be.visible');
          });
        });

        cy.intercept('GET', '**/users/**/invoices/**.pdf').as('getInvoiceRequest');
        cy.contains('Pobierz fakturę w formacie PDF').click();
        cy.wait('@getInvoiceRequest').then(({ request }) => {
          const url = request.url;
          const match = url.match(/invoices\/([a-f0-9\-]+)\.pdf$/);
          const invoiceId = match[1];

          cy.readFile(`tests/e2e/shop/downloads/Faktura za zamówienie_ ${invoiceId}.pdf`, 'binary').should('exist');
        });
      });

      describe('when payment method is is payment-on-delivery', () => {
        before(() => {
          changePaymentMethodToPaymentOnDelivery = true;
        });

        after(() => {
          changePaymentMethodToPaymentOnDelivery = false;
        })

        it('successfully creates order', () => {
          cy.contains('Dziękujemy za dokonanie zakupu!').should('be.visible');
          cy.contains('Pobierz fakturę w formacie PDF').should('be.visible');
          cy.contains('Prosimy o dokonanie płatności według poniszych danych').should('not.exist');

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
    });
  });
});
