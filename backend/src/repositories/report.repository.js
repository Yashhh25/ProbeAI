const Report = require('../models/report.model');

class ReportRepository {
  create(reportData) {
    return Report.create(reportData);
  }

  findByInterviewId(interviewId) {
    return Report.findOne({ interviewId });
  }

  update(interviewId, data) {
    return Report.findOneAndUpdate(
      { interviewId },
      data,
      {
        upsert: true,
        new: true,
      }
    );
  }
}

module.exports = new ReportRepository();