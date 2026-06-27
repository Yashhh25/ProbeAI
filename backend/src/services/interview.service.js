const interviewRepository = require('../repositories/interview.repository');
const messageService = require('./message.service');
const interviewerAgent = require('../ai/agents/interviewer.agent');

class InterviewService {
async createInterview(userId, interviewData) {
const interview = await interviewRepository.create({
...interviewData,
userId,
status: 'active',
startedAt: new Date(),
});


const firstQuestion =
  await interviewerAgent.generateFirstQuestion(interview);

await messageService.addMessage(
  interview._id,
  'ai',
  firstQuestion
);

return interview;


}

async getUserInterviews(userId) {
return interviewRepository.findByUserId(userId);
}

async getInterviewById(interviewId) {
return interviewRepository.findById(interviewId);
}
}

module.exports = new InterviewService();
