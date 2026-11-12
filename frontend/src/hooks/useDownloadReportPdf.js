import { useState } from 'react';
import { downloadReportPdf } from '../services/report.service';

export default function useDownloadReportPdf() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const downloadPdf = async (interviewId, title) => {
    setIsDownloading(true);
    setError(null);

    try {
      const blob = await downloadReportPdf(interviewId);

      let filename = 'ProbeAI-Research-Report.pdf';
      if (title) {
        const clean = title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '-');
        if (clean) {
          filename = `ProbeAI-Research-Report-${clean.slice(0, 40)}.pdf`;
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('PDF download error:', err);
      let message = 'Failed to download PDF report. Please try again.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed?.message) {
            message = parsed.message;
          }
        } catch {
          // Fallback to default message
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message && !err.response) {
        message = 'Network error: Unable to reach the server.';
      }
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadPdf,
    isDownloading,
    error,
    clearError: () => setError(null),
  };
}
