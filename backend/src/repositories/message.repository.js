const Message = require('../models/message.model');

class MessageRepository {
  create(messageData) {
    return Message.create(messageData);
  }

  createMany(messages) {
    return Message.insertMany(messages);
  }

  findByInterviewId(interviewId) {
    return Message.find({ interviewId });
  }

  getTranscript(interviewId) {
    return Message.find({ interviewId }).sort({ sequenceNumber: 1 });
  }

  deleteByInterviewId(interviewId) {
    return Message.deleteMany({ interviewId });
  }
}

module.exports = new MessageRepository();
