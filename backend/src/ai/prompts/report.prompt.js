function buildReportPrompt(transcript) {
  return `
You are a senior qualitative research analyst creating an Executive Research Report from a customer discovery transcript.

REQUIREMENTS:
- Ground all output strictly in the participant's actual responses. Do NOT invent facts or claim information not present in the transcript.
- Summarize core takeaways in the executive summary.
- Extract distinct pain points experienced by the participant.
- Extract explicit or implied feature requests.
- Provide actionable recommendations derived directly from the observed evidence.
- Assess overall sentiment: strictly "positive", "neutral", or "negative".

Return ONLY valid JSON with this exact structure:
{
  "executiveSummary": "Concise summary of findings based strictly on the transcript",
  "painPoints": ["Pain point 1", "Pain point 2"],
  "featureRequests": ["Feature request 1"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "sentiment": "positive"
}

Transcript:
${transcript}
`;
}

module.exports = { buildReportPrompt };