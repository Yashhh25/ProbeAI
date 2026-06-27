const PromptBuilder = require('./base.prompt');

function formatTranscript(transcript) {
  if (!transcript || transcript.length === 0) {
    return 'No transcript provided.';
  }

  if (typeof transcript === 'string') {
    return transcript;
  }

  return transcript
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');
}

class AnalysisPromptBuilder extends PromptBuilder {
  buildSystemPrompt() {
    return `You are an expert qualitative research analyst.

Your responsibilities:
- Analyze interview transcripts objectively
- Extract structured insights without speculation
- Preserve the participant's voice and intent
- Return clear, actionable findings in the requested format`;
  }

  buildUserPrompt() {
    throw new Error('Use a specific analysis template method');
  }

  buildInterviewSummaryPrompt(transcript) {
    return `Task: Interview Summary

Review the transcript below and produce a structured summary including:
- Key themes discussed
- Notable quotes or paraphrased insights
- Overall narrative arc of the conversation

Transcript:
${formatTranscript(transcript)}`;
  }

  buildSentimentAnalysisPrompt(transcript) {
    return `Task: Sentiment Analysis

Review the transcript below and analyze participant sentiment.

Return:
- Overall sentiment (positive, neutral, negative, or mixed)
- Sentiment drivers with supporting evidence from the transcript
- Shifts in sentiment across the conversation, if any

Transcript:
${formatTranscript(transcript)}`;
  }

  buildPainPointExtractionPrompt(transcript) {
    return `Task: Pain Point Extraction

Review the transcript below and extract all pain points expressed by the participant.

For each pain point, include:
- A concise description
- Severity or frequency signals, if mentioned
- Direct evidence from the transcript

Transcript:
${formatTranscript(transcript)}`;
  }

  buildFeatureRequestExtractionPrompt(transcript) {
    return `Task: Feature Request Extraction

Review the transcript below and extract all feature requests or desired capabilities.

For each request, include:
- A concise description of the requested feature or capability
- The underlying need or motivation, if stated
- Direct evidence from the transcript

Transcript:
${formatTranscript(transcript)}`;
  }
}

module.exports = AnalysisPromptBuilder;
