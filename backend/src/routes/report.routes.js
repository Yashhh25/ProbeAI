const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const reportController = require('../controllers/report.controller');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  authMiddleware,
  reportController.generate.bind(reportController)
);

router.get(
  '/',
  authMiddleware,
  reportController.getReport.bind(reportController)
);

router.get(
  '/pdf',
  authMiddleware,
  reportController.downloadPdf.bind(reportController)
);

module.exports = router;