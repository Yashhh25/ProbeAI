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

  async generateClosingMessage(interview, transcript) {
    const messages = [
      {
        role: 'system',
        content: `You are a senior qualitative market researcher.
The interview has reached its planned maximum turn limit. Thank the participant for their time and valuable insights, inform them that the interview is now complete, and state that their input will be synthesized into the executive report. Keep it professional, warm, and concise. Return ONLY the closing statement.`,
      },
      {
        role: 'user',
        content: this.promptBuilder.buildUserPrompt(
          interview.topic,
          transcript
        ),
      },
    ];

    try {
      const response = await this.provider.generate(messages);
      return response.content;
    } catch {
      return "Thank you so much for participating in this research session! Your responses have provided invaluable insights for our team and will now be compiled into the executive research report. This interview session is now complete.";
    }
  }
}

module.exports = new InterviewerAgent();