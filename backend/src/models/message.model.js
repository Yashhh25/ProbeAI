const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },

    role: {
      type: String,
      enum: ['ai', 'user'],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sequenceNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ interviewId: 1, sequenceNumber: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;