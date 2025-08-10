const { defineConfig } = require('cypress');

const ROOT_PATH = 'tests/e2e/shop';
const HOST = 'http://localhost';

module.exports = defineConfig({
  e2e: {
    specPattern: `${ROOT_PATH}/specs/**/*.cy.{js,jsx,ts,tsx}`,
    supportFile: `${ROOT_PATH}/support/e2e.js`,
    downloadsFolder: `${ROOT_PATH}/downloads`,
    screenshotsFolder: `${ROOT_PATH}/screenshots`,
    baseUrl: `${HOST}:3003`,
    apiUrl: `${HOST}:3333`,
    env: {
      sidekiqPanelLogin: process.env.SIDEKIQ_PANEL_LOGIN,
      sidekiqPanelPassword: process.env.SIDEKIQ_PANEL_PASSWORD
    }
  }
});
