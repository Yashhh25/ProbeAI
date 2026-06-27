const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
    },

    summary: {
      type: String,
      required: true,
    },

    sentiment: {
      score: {
        type: Number,
      },
      label: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
      },
    },

    painPoints: {
      type: [String],
      default: [],
    },

    featureRequests: {
      type: [String],
      default: [],
    },

    keyInsights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ interviewId: 1 }, { unique: true });

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;