const interviewService = require('../services/interview.service');
const messageService = require('../services/message.service');
const insightsService = require('../services/insights.service');

class InterviewController {
  async createInterview(req, res, next) {
    try {
      const interview = await interviewService.createInterview(
        req.user.userId,
        req.body
      );

      res.status(201).json({
        success: true,
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserInterviews(req, res, next) {
    try {
      const interviews = await interviewService.getUserInterviews(
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: interviews,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterviewById(req, res, next) {
    try {
      const interview = await interviewService.getInterviewById(
        req.params.id
      );

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found',
        });
      }

      res.status(200).json({
        success: true,
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTranscript(req, res, next) {
    try {
      const transcript = await messageService.getTranscript(
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: transcript,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsights(req, res, next) {
    try {
      const insights = await insightsService.getInsights(
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InterviewController();