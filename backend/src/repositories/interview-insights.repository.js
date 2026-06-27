const InterviewInsights = require('../models/interview-insights.model');

class InterviewInsightsRepository {
  create(data) {
    return InterviewInsights.create(data);
  }

  findByInterviewId(interviewId) {
    return InterviewInsights.findOne({ interviewId });
  }

  updateByInterviewId(interviewId, data) {
    return InterviewInsights.findOneAndUpdate(
      { interviewId },
      data,
      { new: true, runValidators: true, upsert: true }
    );
  }

  deleteByInterviewId(interviewId) {
    return InterviewInsights.deleteOne({ interviewId });
  }
}

module.exports = new InterviewInsightsRepository();
