const mongoose = require('mongoose');

const interviewInsightsSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
    },

    painPoints: {
      type: [String],
      default: [],
    },

    featureRequests: {
      type: [String],
      default: [],
    },

    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      required: true,
      default: 'neutral',
    },

    summary: {
      type: String,
      default: '',
    },

    lastProcessedSequenceNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewInsights = mongoose.model('InterviewInsights', interviewInsightsSchema);

module.exports = InterviewInsights;
