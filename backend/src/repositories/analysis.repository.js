const Analysis = require('../models/analysis.model');

class AnalysisRepository {
  create(data) {
    return Analysis.create(data);
  }

  findByInterviewId(interviewId) {
    return Analysis.findOne({ interviewId });
  }

  updateByInterviewId(interviewId, data) {
    return Analysis.findOneAndUpdate({ interviewId }, data, { new: true ,runValidators: true,});
  }

  deleteByInterviewId(interviewId) {
    return Analysis.deleteOne({ interviewId });
  }
}

module.exports = new AnalysisRepository();
