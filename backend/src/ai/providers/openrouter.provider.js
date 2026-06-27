const axios = require('axios');
const env = require('../../config/env');
const BaseProvider = require('./base.provider');

class OpenRouterProvider extends BaseProvider {
  constructor() {
    super();
    this.apiKey = env.openRouterApiKey;
    this.baseUrl = env.openRouterBaseUrl;
    this.model = env.aiModel;
  }

  async generate(messages, options = {}) {
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 300,
        top_p: options.top_p ?? 1,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const choice = response.data.choices[0];

    return {
      content: choice.message.content,
      usage: response.data.usage,
      finishReason: choice.finish_reason,
    };
  }
}

module.exports = OpenRouterProvider;
