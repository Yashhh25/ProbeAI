const Interview = require('../models/interview.model');
const { ACTIVE } = require('../constants/interviewStatus');

class InterviewRepository {
  create(interviewData) {
    return Interview.create(interviewData);
  }

  findById(interviewId) {
    return Interview.findById(interviewId);
  }

  findByUserId(userId) {
    return Interview.find({ userId });
  }

  updateById(interviewId, updateData) {
    return Interview.findByIdAndUpdate(interviewId, updateData, { new: true,runValidators: true,});
  }

  deleteById(interviewId) {
    return Interview.findByIdAndDelete(interviewId);
  }

  findActiveInterview(interviewId) {
    return Interview.findOne({ _id: interviewId, status: ACTIVE });
  }
}

module.exports = new InterviewRepository();
