const PromptBuilder = require('./base.prompt');

function formatAnalysisInput(analysis) {
  if (!analysis) {
    return 'No analysis input provided.';
  }

  if (typeof analysis === 'string') {
    return analysis;
  }

  return JSON.stringify(analysis, null, 2);
}

class RecommendationPromptBuilder extends PromptBuilder {
  buildSystemPrompt() {
    return `You are a product strategy advisor specializing in decision intelligence.

Your responsibilities:
- Translate research insights into actionable recommendations
- Ground every recommendation in the supplied analysis
- Clearly separate observations from recommendations
- Avoid inventing data not present in the input`;
  }

  buildUserPrompt() {
    throw new Error('Use a specific recommendation template method');
  }

  buildProductRecommendationsPrompt(analysis) {
    return `Task: Product Recommendations

Using the analysis below, recommend product changes or initiatives that address the identified needs.

Return:
- Recommended actions with rationale
- Expected impact on user pain points or unmet needs
- Dependencies or assumptions

Analysis:
${formatAnalysisInput(analysis)}`;
  }

  buildPrioritizationPrompt(analysis) {
    return `Task: Prioritization

Using the analysis below, prioritize the identified opportunities or initiatives.

Return a ranked list with:
- Priority rank
- Item description
- Rationale for ranking
- Estimated impact and effort signals, when inferable from the analysis

Analysis:
${formatAnalysisInput(analysis)}`;
  }

  buildOpportunityAnalysisPrompt(analysis) {
    return `Task: Opportunity Analysis

Using the analysis below, identify and evaluate market or product opportunities.

Return:
- Opportunity description
- Target user need or pain point addressed
- Potential value hypothesis
- Risks or open questions

Analysis:
${formatAnalysisInput(analysis)}`;
  }
}

module.exports = RecommendationPromptBuilder;
