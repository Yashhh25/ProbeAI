const OpenRouterProvider = require('./openrouter.provider');

let providerInstance;

function getProvider() {
  if (!providerInstance) {
    providerInstance = new OpenRouterProvider();
  }

  return providerInstance;
}

module.exports = { getProvider };
