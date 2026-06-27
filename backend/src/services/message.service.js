const messageRepository = require('../repositories/message.repository');
const interviewRepository = require('../repositories/interview.repository');
const interviewerAgent = require('../ai/agents/interviewer.agent');
const insightsService = require('./insights.service');

class MessageService {
  async addMessage(interviewId, role, content) {
    const transcript = await messageRepository.getTranscript(
      interviewId
    );

    const sequenceNumber = transcript.length + 1;

    const savedMessage = await messageRepository.create({
      interviewId,
      role,
      content,
      sequenceNumber,
    });

    if (role === 'user') {
      const interview =
        await interviewRepository.findById(interviewId);

      const updatedTranscript =
        await messageRepository.getTranscript(interviewId);

      const aiQuestion =
        await interviewerAgent.generateFollowUpQuestion(
          interview,
          updatedTranscript
        );

      await messageRepository.create({
        interviewId,
        role: 'ai',
        content: aiQuestion,
        sequenceNumber: sequenceNumber + 1,
      });

      // Asynchronously trigger insights generation in the background
      insightsService.generateInsights(interviewId).catch((err) => {
        console.error('Failed to generate insights in background:', err);
      });
    }

    return savedMessage;
  }

  async getTranscript(interviewId) {
    return messageRepository.getTranscript(interviewId);
  }
}

module.exports = new MessageService();