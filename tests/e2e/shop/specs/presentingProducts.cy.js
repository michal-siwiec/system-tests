const selectSpecifiedGroupOfProducts = (link) => {
  cy.trackRequest({ operationName: 'ProductsDetails' });
  cy.contains(link).click();
  cy.wait('@ProductsDetails');
};

const testContentPresence = (productTitles) => {
  productTitles.forEach((productTitle) => cy.get('[data-testid="product-container"]').should('contain.text', productTitle));
};

describe('Presenting producs', () => {
  beforeEach(() => {
    cy.trackRequest({ operationName: 'ProductsDetails' });
    cy.visit('/');
    cy.wait('@ProductsDetails');
  });

  it('shows only promoted products / route', () => {
    testContentPresence(['Tynk akrylowy', 'Grunt głęboko penetrujący', 'Poziomica PRO']);
  });

  it('shows all products on /products route', () => {
    selectSpecifiedGroupOfProducts('Produkty')
    testContentPresence(['Taśma kalenicowa', 'Tynk nanosilikonowy', 'Świetlik', 'Tynk mozaikowy', 'Tynk akrylowy']);
  });

  it("shows only products from category 'tools'", () => {
    selectSpecifiedGroupOfProducts('Narzędzia');
    testContentPresence(['Poziomica PRO', 'Dalmierz PRO laserowy']);
  });

  it("shows only products from category 'constructionChemicals'", () => {
    selectSpecifiedGroupOfProducts('Chemia budowlana');
    testContentPresence(['Tynk nanosilikonowy', 'Tynk mozaikowy', 'Tynk akrylowy', 'Klej do styropianu', 'Klej do dociepleń']);
  });

  it("shows only products from category 'stairway'", () => {
    selectSpecifiedGroupOfProducts('Schody');
    testContentPresence(['Segment przesuwny', 'Listwa wykończeniowa Fakro', 'Kątowniki montażowe do schodów strychowych', 'Schody strychowe']);
  });

  it("shows only products from category 'roofZone'", () => {
    selectSpecifiedGroupOfProducts('Strefa dachu');
    testContentPresence(['Taśma kalenicowa', 'Świetlik', 'Mocownik łaty kominiarskiej', 'Wspornik łaty kalenicowej', 'Kratka zabezpieczająca przed ptactwem']);
  });

  it("shows only products from category 'foundationZone'", () => {
    selectSpecifiedGroupOfProducts('Strefa fundamentu');
    testContentPresence(['Bloczek Termalika', 'Syropian fundamentowy 15 cm', 'Syropian fundamentowy 16 cm', 'Syropian fundamentowy 1 cm7', 'Folia kubełkowa']);
  });

  it("presents product as disabled when available quantity is 0", () => {
    selectSpecifiedGroupOfProducts('Strefa dachu');
    cy.contains('[data-testid="product-container"]', 'Taśma kalenicowa')
      .should('be.visible')
      .and('contain.text', 'Produkt niedostępny');
  });
});
