const messageRepository = require('../repositories/message.repository');
const interviewRepository = require('../repositories/interview.repository');
const interviewerAgent = require('../ai/agents/interviewer.agent');
const insightsService = require('./insights.service');

class MessageService {
  async addMessage(interviewId, userIdOrRole, roleOrContent, contentMaybe) {
    let userId, role, content;
    if (contentMaybe !== undefined) {
      userId = userIdOrRole;
      role = roleOrContent;
      content = contentMaybe;
    } else {
      userId = null;
      role = userIdOrRole;
      content = roleOrContent;
    }

    const interview = userId
      ? await interviewRepository.findByIdAndUserId(interviewId, userId)
      : await interviewRepository.findById(interviewId);

    if (!interview) {
      const err = new Error('Interview not found');
      err.statusCode = 404;
      throw err;
    }

    if (interview.status === 'completed') {
      const err = new Error('Interview is already completed');
      err.statusCode = 400;
      throw err;
    }

    const transcript = await messageRepository.getTranscript(interviewId);
    const sequenceNumber = transcript.length + 1;

    const savedMessage = await messageRepository.create({
      interviewId,
      role,
      content,
      sequenceNumber,
    });

    if (role === 'user') {
      const updatedTranscript = await messageRepository.getTranscript(interviewId);
      const aiQuestionCount = updatedTranscript.filter((m) => m.role === 'ai').length;

      const maxTurns = interview.maxTurns || 10;

      if (aiQuestionCount >= maxTurns) {
        // Max turns reached - send closing message and complete interview
        const closingMessage = await interviewerAgent.generateClosingMessage(
          interview,
          updatedTranscript
        );

        await messageRepository.create({
          interviewId,
          role: 'ai',
          content: closingMessage,
          sequenceNumber: sequenceNumber + 1,
        });

        await interviewRepository.markCompleted(interviewId);
      } else {
        // Generate contextual follow-up question
        const aiQuestion = await interviewerAgent.generateFollowUpQuestion(
          interview,
          updatedTranscript
        );

        await messageRepository.create({
          interviewId,
          role: 'ai',
          content: aiQuestion,
          sequenceNumber: sequenceNumber + 1,
        });
      }

      // Asynchronously trigger insights generation in background
      insightsService.generateInsights(interviewId).catch((err) => {
        console.error('Failed to generate insights in background:', err);
      });
    }

    return savedMessage;
  }

  async getTranscript(interviewId, userId) {
    const interview = userId
      ? await interviewRepository.findByIdAndUserId(interviewId, userId)
      : await interviewRepository.findById(interviewId);

    if (!interview) {
      const err = new Error('Interview not found');
      err.statusCode = 404;
      throw err;
    }

    return messageRepository.getTranscript(interviewId);
  }
}

module.exports = new MessageService();