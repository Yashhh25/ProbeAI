const axios = require('axios');
const env = require('../../config/env');
const BaseProvider = require('./base.provider');

class OpenRouterProvider extends BaseProvider {
  constructor(config = {}) {
    super();
    this.apiKey = config.apiKey ?? env.openRouterApiKey;
    this.baseUrl = this.normalizeBaseUrl(config.baseUrl ?? env.openRouterBaseUrl);
    this.model = config.model ?? env.aiModel;
    this.defaultTimeoutMs = 30000;
  }

  normalizeBaseUrl(url) {
    if (!url || typeof url !== 'string') {
      return '';
    }
    return url.trim().replace(/\/+$/, '');
  }

  getEndpoint() {
    return `${this.baseUrl}/chat/completions`;
  }

  validateResponse(data) {
    if (!data || typeof data !== 'object') {
      const err = new Error('AI provider returned an invalid or empty response structure');
      err.statusCode = 502;
      throw err;
    }

    if (!Array.isArray(data.choices) || data.choices.length === 0) {
      const err = new Error('AI provider response contains no completion choices');
      err.statusCode = 502;
      throw err;
    }

    const firstChoice = data.choices[0];
    if (!firstChoice || typeof firstChoice !== 'object' || !firstChoice.message) {
      const err = new Error('AI provider choice is missing valid message structure');
      err.statusCode = 502;
      throw err;
    }

    if (typeof firstChoice.message.content !== 'string') {
      const err = new Error('AI provider message does not contain valid text content');
      err.statusCode = 502;
      throw err;
    }

    return firstChoice;
  }

  handleAxiosError(error) {
    // 1. Check for request timeout
    if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      /timeout/i.test(error.message)
    ) {
      console.error('[OpenRouterProvider] Request timed out after 30 seconds');
      const err = new Error('AI service request timed out. Please try again.');
      err.statusCode = 504;
      return err;
    }

    // 2. HTTP response received from OpenRouter with error status
    if (error.response) {
      const { status, data, statusText } = error.response;
      let rawMsg = data?.error?.message || (typeof data === 'string' ? data : statusText) || 'No detail provided';
      if (typeof rawMsg !== 'string') {
        rawMsg = JSON.stringify(rawMsg);
      }

      // Sanitize any key patterns before logging
      let sanitizedMsg = rawMsg;
      if (this.apiKey) {
        sanitizedMsg = sanitizedMsg.replaceAll(this.apiKey, '[REDACTED]');
      }
      sanitizedMsg = sanitizedMsg.replace(/sk-[a-zA-Z0-9_\-]{6,}/g, '[REDACTED]');

      // Safe diagnostic logging on server (never log headers or auth secrets)
      console.error(
        `[OpenRouterProvider] Provider responded with HTTP ${status}:`,
        sanitizedMsg
      );

      let appError;
      switch (status) {
        case 401:
          appError = new Error('AI service authentication failed. Please check provider credentials.');
          appError.statusCode = 502;
          break;
        case 402:
          appError = new Error('AI service credits exhausted or payment required. Please check account balance.');
          appError.statusCode = 502;
          break;
        case 429:
          appError = new Error('AI service rate limit reached. Please wait a moment and try again.');
          appError.statusCode = 429;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          appError = new Error('AI service provider is temporarily unavailable. Please try again shortly.');
          appError.statusCode = 503;
          break;
        default:
          appError = new Error(`AI service request failed with HTTP ${status}.`);
          appError.statusCode = status >= 400 && status < 500 ? status : 502;
          break;
      }
      return appError;
    }

    // 3. Network failure / connection refused (request made but no response)
    if (error.request) {
      console.error('[OpenRouterProvider] Network error reaching AI provider:', error.code || error.message);
      const appError = new Error('Unable to connect to AI service. Please check network connectivity.');
      appError.statusCode = 503;
      return appError;
    }

    // 4. Any other unexpected error
    console.error('[OpenRouterProvider] Unexpected error:', error.message);
    const appError = new Error(error.message || 'An unexpected AI service error occurred.');
    appError.statusCode = error.statusCode || 500;
    return appError;
  }

  async generate(messages, options = {}) {
    let response;

    try {
      response = await axios.post(
        this.getEndpoint(),
        {
          model: this.model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 300,
          top_p: options.top_p ?? 1,
        },
        {
          timeout: options.timeout ?? this.defaultTimeoutMs,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://probeai.local',
            'X-Title': 'ProbeAI',
          },
        }
      );
    } catch (error) {
      throw this.handleAxiosError(error);
    }

    const choice = this.validateResponse(response.data);

    return {
      content: choice.message.content,
      usage: response.data.usage || null,
      finishReason: choice.finish_reason || null,
    };
  }
}

module.exports = OpenRouterProvider;
