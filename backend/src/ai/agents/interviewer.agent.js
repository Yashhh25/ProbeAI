const { getProvider } = require('../providers/provider.factory');
const InterviewPromptBuilder = require('../prompts/interview.prompt');

class InterviewerAgent {
  constructor() {
    this.provider = getProvider();
    this.promptBuilder = new InterviewPromptBuilder();
  }

  async generateFirstQuestion(interview) {
    const messages = [
      {
        role: 'system',
        content: this.promptBuilder.buildSystemPrompt(),
      },
      {
        role: 'user',
        content: `Interview topic: ${interview.topic}

Generate the first interview question.`,
      },
    ];

    const response = await this.provider.generate(messages);

    return response.content;
  }

  async generateFollowUpQuestion(interview, transcript) {
    const messages = [
      {
        role: 'system',
        content: this.promptBuilder.buildSystemPrompt(),
      },
      {
        role: 'user',
        content: this.promptBuilder.buildUserPrompt(
          interview.topic,
          transcript
        ),
      },
    ];

    const response = await this.provider.generate(messages);

    return response.content;
  }
}

module.exports = new InterviewerAgent();