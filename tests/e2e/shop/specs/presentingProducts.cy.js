const testContentPresence = (({ header, productTitles }) => {
  cy.contains(header).should('exist');
  productTitles.forEach((productTitle) => cy.get('[data-testid="product-container"]').should('contain.text', productTitle));
});

const selectSpecifiedGroupOfProducts = (link) => {
  cy.trackRequest({ operationName: 'ProductsDetails' });
  cy.contains(link).click();
  cy.wait('@ProductsDetails');
};

describe('Presenting producs', () => {
  beforeEach(() => {
    cy.trackRequest({ operationName: 'ProductsDetails' });
    cy.visit('/');
    cy.wait('@ProductsDetails');
  });

  it('shows only promoted products / route', () => {
    testContentPresence({ header: 'Polecane produkty', productTitles: ['Tynk akrylowy', 'Grunt głęboko penetrujący', 'Poziomica PRO'] });
  });

  it('shows all products on /products route', () => {
    selectSpecifiedGroupOfProducts('Produkty')
    testContentPresence({ header: 'Wszystkie produkty', productTitles: ['Taśma kalenicowa', 'Tynk nanosilikonowy', 'Świetlik', 'Tynk mozaikowy', 'Tynk akrylowy'] });
  });

  it("shows only products from category 'tools'", () => {
    selectSpecifiedGroupOfProducts('Narzędzia');
    testContentPresence({ header: 'Produkty z kategori "Narzędzia"', productTitles: ['Poziomica PRO', 'Dalmierz PRO laserowy'] });
  });

  it("shows only products from category 'constructionChemicals'", () => {
    selectSpecifiedGroupOfProducts('Chemia budowlana');
    testContentPresence({ header: 'Produkty z kategori "Materiały chemiczne"', productTitles: ['Tynk nanosilikonowy', 'Tynk mozaikowy', 'Tynk akrylowy', 'Klej do styropianu', 'Klej do dociepleń'] });
  });

  it("shows only products from category 'stairway'", () => {
    selectSpecifiedGroupOfProducts('Schody');
    testContentPresence({ header: 'Produkty z kategori "Schody"', productTitles: ['Segment przesuwny', 'Listwa wykończeniowa Fakro', 'Kątowniki montażowe do schodów strychowych', 'Schody strychowe'] });
  });

  it("shows only products from category 'roofZone'", () => {
    selectSpecifiedGroupOfProducts('Strefa dachu');
    testContentPresence({ header: 'Produkty z kategori "Strefa dachu"', productTitles: ['Taśma kalenicowa', 'Świetlik', 'Mocownik łaty kominiarskiej', 'Wspornik łaty kalenicowej', 'Kratka zabezpieczająca przed ptactwem'] });
  });

  it("shows only products from category 'foundationZone'", () => {
    selectSpecifiedGroupOfProducts('Strefa fundamentu');
    testContentPresence({ header: 'Produkty z kategori "Strefa fundamentu"', productTitles: ['Bloczek Termalika', 'Syropian fundamentowy 15 cm', 'Syropian fundamentowy 16 cm', 'Syropian fundamentowy 1 cm7', 'Folia kubełkowa'] });
  });
});
