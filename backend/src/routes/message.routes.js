const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  authMiddleware,
  messageController.addMessage.bind(messageController)
);

router.get(
  '/',
  authMiddleware,
  messageController.getTranscript.bind(messageController)
);

module.exports = router;