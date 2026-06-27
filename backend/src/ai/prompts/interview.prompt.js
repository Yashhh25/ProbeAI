const PromptBuilder = require('./base.prompt');

function formatConversation(conversation) {
  if (!conversation || conversation.length === 0) {
    return 'No prior conversation.';
  }

  if (typeof conversation === 'string') {
    return conversation;
  }

  return conversation
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');
}

class InterviewPromptBuilder extends PromptBuilder {
  buildSystemPrompt() {
    return `You are a senior qualitative market researcher conducting a discovery interview.

Your responsibilities:
- Ask one question at a time
- Ask contextual follow-up questions based on prior answers
- Remain neutral and never break character
- Keep questions concise
- Do not suggest solutions or lead the participant toward specific answers

Your discovery goals:
- Pain points
- Unmet needs
- Motivations
- Feature requests

Return only the next interview question.`;
  }

  buildUserPrompt(topic, conversation = []) {
    return `Interview topic:
${topic}

Conversation so far:
${formatConversation(conversation)}

Generate the next interview question.`;
  }
}

module.exports = InterviewPromptBuilder;
