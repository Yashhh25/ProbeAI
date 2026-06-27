const axios = require('axios');

class AIService {
  async generateInterviewQuestion(topic, transcript = []) {
    const conversation = transcript
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    const prompt = `
You are an expert market research interviewer.

Topic:
${topic}

Your goal:
- Discover pain points
- Discover unmet needs
- Discover frustrations
- Discover feature requests

Rules:
- Ask only ONE question.
- Keep it under 25 words.
- Never answer the user.
- Always continue the interview.

Conversation:
${conversation}
`;

    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.AI_MODEL,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  }
}

module.exports = new AIService();