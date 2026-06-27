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

class InsightsPromptBuilder extends PromptBuilder {
  buildSystemPrompt() {
    return `You are a data intelligence engine for qualitative customer interviews.
Your task is to analyze the interview transcript and extract structured insights.

You MUST respond with a single, valid, raw JSON object containing exactly the following schema. No other text, formatting, explanation, or code block syntax.

{
  "painPoints": string[],
  "featureRequests": string[],
  "sentiment": "positive" | "neutral" | "negative",
  "summary": string
}

Definitions & Rules:
1. "painPoints" (array of strings): High-priority, specific user frustrations, bottlenecks, obstacles, and friction. Keep each point brief, actionable, and concrete. Limit to a maximum of 5 most critical points.
2. "featureRequests" (array of strings): Specific suggestions or requirements for products or solutions expressed by the user (either explicitly requested or clearly inferred from their problems). Keep them concise. Limit to a maximum of 5.
3. "sentiment" (string): The overall customer tone across the conversation. Must be exactly one of: "positive", "neutral", or "negative".
4. "summary" (string): A precise summary under 60 words capturing the core context of the interview. Do not repeat the topic name word-for-word, instead synthesize what was discovered.
5. Critical: Do not wrap the JSON output in markdown blocks (e.g. do NOT use \`\`\`json ... \`\`\`). Return only the raw JSON string starting with { and ending with }.`;
  }

  buildUserPrompt(topic, conversation = []) {
    return `Interview Topic:
${topic}

Transcript:
${formatConversation(conversation)}

Analyze the transcript and generate the insights JSON object:`;
  }
}

module.exports = InsightsPromptBuilder;
