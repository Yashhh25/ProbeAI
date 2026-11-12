const reportRepository = require('../repositories/report.repository');
const messageRepository = require('../repositories/message.repository');
const interviewRepository = require('../repositories/interview.repository');
const { getProvider } = require('../ai/providers/provider.factory');
const { buildReportPrompt } = require('../ai/prompts/report.prompt');

function parseReportJSON(rawContent) {
  if (!rawContent) {
    throw new Error('AI returned empty response');
  }

  let clean = rawContent.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // Fallthrough
      }
    }
    throw new Error('Failed to parse AI report response');
  }
}

function normalizeReportData(parsed = {}) {
  const validSentiments = ['positive', 'neutral', 'negative'];
  const rawSentiment = typeof parsed.sentiment === 'string' ? parsed.sentiment.toLowerCase().trim() : 'neutral';

  return {
    executiveSummary: typeof parsed.executiveSummary === 'string' ? parsed.executiveSummary.trim() : '',
    painPoints: Array.isArray(parsed.painPoints) ? parsed.painPoints.filter((p) => typeof p === 'string' && p.trim()) : [],
    featureRequests: Array.isArray(parsed.featureRequests) ? parsed.featureRequests.filter((f) => typeof f === 'string' && f.trim()) : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.filter((r) => typeof r === 'string' && r.trim()) : [],
    sentiment: validSentiments.includes(rawSentiment) ? rawSentiment : 'neutral',
  };
}

class ReportService {
  constructor() {
    this.provider = getProvider();
  }

  async generateReport(interviewId, userId) {
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      const err = new Error('Interview not found');
      err.statusCode = 404;
      throw err;
    }

    const transcript = await messageRepository.getTranscript(interviewId);
    const hasUserResponses = transcript && transcript.some((msg) => msg.role === 'user');

    if (!hasUserResponses) {
      const err = new Error('Not enough interview data to generate a report.');
      err.statusCode = 400;
      throw err;
    }

    const transcriptText = transcript
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    const prompt = buildReportPrompt(transcriptText);

    const response = await this.provider.generate([
      {
        role: 'system',
        content: 'You are a senior customer research analyst. Return only valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const parsedData = parseReportJSON(response.content);
    const reportData = normalizeReportData(parsedData);

    return reportRepository.update(interviewId, {
      interviewId,
      ...reportData,
      generatedAt: new Date(),
    });
  }

  async getReport(interviewId, userId) {
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      const err = new Error('Interview not found');
      err.statusCode = 404;
      throw err;
    }
    return reportRepository.findByInterviewId(interviewId);
  }
}

module.exports = new ReportService();