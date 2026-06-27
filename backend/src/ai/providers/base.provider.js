class BaseProvider {
  async generate(messages, options = {}) {
    throw new Error('generate() must be implemented by subclass');
  }
}

module.exports = BaseProvider;
