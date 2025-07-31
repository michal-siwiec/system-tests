const { defineConfig } = require('cypress');

const ROOT_PATH = 'tests/e2e/shop';

module.exports = defineConfig({
  e2e: {
    specPattern: `${ROOT_PATH}/specs/**/*.cy.{js,jsx,ts,tsx}`,
    supportFile: `${ROOT_PATH}/support/e2e.js`,
    baseUrl: 'http://localhost:3003',
    downloadsFolder: `${ROOT_PATH}/downloads`,
    screenshotsFolder: `${ROOT_PATH}/screenshots`
  }
});
