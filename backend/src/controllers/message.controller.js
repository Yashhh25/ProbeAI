const messageService = require('../services/message.service');

class MessageController {
  async addMessage(req, res, next) {
    try {
      const { role, content } = req.body;

      const message = await messageService.addMessage(
        req.params.interviewId,
        role,
        content
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTranscript(req, res, next) {
    try {
      const transcript = await messageService.getTranscript(
        req.params.interviewId
      );

      res.status(200).json({
        success: true,
        data: transcript,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();