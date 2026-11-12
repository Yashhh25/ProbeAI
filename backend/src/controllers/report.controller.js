const reportService = require('../services/report.service');
const reportPdfService = require('../services/report-pdf.service');

class ReportController {
  async generate(req, res, next) {
    try {
      const report =
        await reportService.generateReport(
          req.params.interviewId,
          req.user?.userId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReport(req, res, next) {
    try {
      const report =
        await reportService.getReport(
          req.params.interviewId,
          req.user?.userId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadPdf(req, res, next) {
    try {
      const { pdfBuffer, filename } = await reportPdfService.generateReportPdf(
        req.params.interviewId,
        req.user?.userId
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();