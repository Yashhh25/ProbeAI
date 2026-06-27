const express = require('express');
const interviewController = require('../controllers/interview.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  interviewController.createInterview.bind(interviewController)
);

router.get(
  '/',
  authMiddleware,
  interviewController.getUserInterviews.bind(interviewController)
);

router.get(
  '/:id/messages',
  authMiddleware,
  interviewController.getTranscript.bind(interviewController)
);

router.get(
  '/:id/insights',
  authMiddleware,
  interviewController.getInsights.bind(interviewController)
);

router.get(
  '/:id',
  authMiddleware,
  interviewController.getInterviewById.bind(interviewController)
);

module.exports = router;