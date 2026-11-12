const mongoose = require('mongoose');
const Interview = require('../models/interview.model');
const { ACTIVE } = require('../constants/interviewStatus');

class InterviewRepository {
  create(interviewData) {
    return Interview.create(interviewData);
  }

  findById(interviewId) {
    if (!mongoose.isValidObjectId(interviewId)) {
      return null;
    }
    return Interview.findById(interviewId);
  }

  findByIdAndUserId(interviewId, userId) {
    if (
      !mongoose.isValidObjectId(interviewId) ||
      (userId && !mongoose.isValidObjectId(userId))
    ) {
      return null;
    }
    return Interview.findOne({ _id: interviewId, userId });
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

  markCompleted(interviewId) {
    return Interview.findByIdAndUpdate(
      interviewId,
      {
        status: 'completed',
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }
}

module.exports = new InterviewRepository();
