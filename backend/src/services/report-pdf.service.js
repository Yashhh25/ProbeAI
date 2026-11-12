const PDFDocument = require('pdfkit');
const interviewRepository = require('../repositories/interview.repository');
const reportRepository = require('../repositories/report.repository');
const messageRepository = require('../repositories/message.repository');

function sanitizeFilename(title) {
  if (!title) return 'ProbeAI-Research-Report.pdf';
  const clean = title
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return clean ? `ProbeAI-Research-Report-${clean.slice(0, 40)}.pdf` : 'ProbeAI-Research-Report.pdf';
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

class ReportPdfService {
  async generateReportPdf(interviewId, userId) {
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      const err = new Error('Interview not found');
      err.statusCode = 404;
      throw err;
    }

    const report = await reportRepository.findByInterviewId(interviewId);
    if (!report) {
      const err = new Error('Research report has not been generated yet.');
      err.statusCode = 404;
      throw err;
    }

    let transcriptCount = 0;
    try {
      const transcript = await messageRepository.getTranscript(interviewId);
      if (Array.isArray(transcript)) {
        transcriptCount = transcript.length;
      }
    } catch {
      // Transcript statistics are optional, non-blocking
    }

    const filename = sanitizeFilename(interview.title);
    const pdfBuffer = await this.buildPdfDocument({ interview, report, transcriptCount });

    return {
      pdfBuffer,
      filename,
    };
  }

  buildPdfDocument({ interview, report, transcriptCount }) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const margin = 50;
      const usableWidth = doc.page.width - margin * 2;
      const bottomLimit = doc.page.height - margin - 40;

      const colors = {
        primaryText: '#0f172a',
        secondaryText: '#475569',
        mutedText: '#64748b',
        border: '#e2e8f0',
        cardBg: '#f8fafc',
        teal: '#0d9488',
        tealDark: '#115e59',
        tealBg: '#f0fdfa',
        emerald: '#059669',
        emeraldBg: '#ecfdf5',
        emeraldBorder: '#a7f3d0',
        rose: '#dc2626',
        roseBg: '#fef2f2',
        roseBorder: '#fecaca',
        slateBg: '#f1f5f9',
        slateBorder: '#cbd5e1',
      };

      function ensureSpace(neededHeight) {
        if (doc.y + neededHeight > bottomLimit) {
          doc.addPage();
        }
      }

      function drawDivider(gapBefore = 12, gapAfter = 14) {
        doc.y += gapBefore;
        doc
          .strokeColor(colors.border)
          .lineWidth(0.75)
          .moveTo(margin, doc.y)
          .lineTo(margin + usableWidth, doc.y)
          .stroke();
        doc.y += gapAfter;
      }

      function drawSectionHeading(title) {
        ensureSpace(60);
        const y = doc.y;
        // Accent bar
        doc
          .rect(margin, y + 1, 3.5, 11)
          .fill(colors.teal);

        doc
          .font('Helvetica-Bold')
          .fontSize(10.5)
          .fillColor(colors.primaryText)
          .text(title.toUpperCase(), margin + 10, y, {
            characterSpacing: 0.8,
          });

        doc.y += 10;
      }

      function drawNumberedList(items, emptyText, accentColor, numBgColor) {
        if (!items || items.length === 0) {
          ensureSpace(24);
          doc
            .font('Helvetica-Oblique')
            .fontSize(9)
            .fillColor(colors.mutedText)
            .text(emptyText, margin + 10, doc.y, { width: usableWidth - 10 });
          doc.y += 8;
          return;
        }

        items.forEach((item, index) => {
          ensureSpace(32);
          const currentY = doc.y;
          const numText = `${index + 1}`;

          // Number badge
          const badgeSize = 16;
          doc
            .roundedRect(margin, currentY, badgeSize, badgeSize, 3)
            .fill(numBgColor || colors.slateBg);

          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor(accentColor || colors.teal)
            .text(numText, margin, currentY + 3.5, {
              width: badgeSize,
              align: 'center',
            });

          // Text content
          const textX = margin + badgeSize + 8;
          const textWidth = usableWidth - (badgeSize + 8);
          doc
            .font('Helvetica')
            .fontSize(9)
            .fillColor(colors.primaryText)
            .text(item, textX, currentY + 1.5, {
              width: textWidth,
              lineGap: 2.5,
            });

          doc.y += 8;
        });
      }

      // ----------------------------------------------------
      // 1. BRAND HEADER
      // ----------------------------------------------------
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(colors.teal)
        .text('PROBEAI', margin, margin, { characterSpacing: 1.5 });

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(colors.mutedText)
        .text('AI-Powered Customer Research', margin, doc.y + 2);

      drawDivider(8, 14);

      // ----------------------------------------------------
      // 2. DOCUMENT TITLE & METADATA
      // ----------------------------------------------------
      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor(colors.teal)
        .text('EXECUTIVE RESEARCH REPORT', margin, doc.y, {
          characterSpacing: 1,
        });

      doc.y += 4;
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(colors.primaryText)
        .text(interview.title || 'Customer Discovery Interview', margin, doc.y, {
          width: usableWidth,
          lineGap: 2,
        });

      doc.y += 10;

      // Metadata card
      const metaCardY = doc.y;
      const metaCardHeight = 48;
      doc
        .roundedRect(margin, metaCardY, usableWidth, metaCardHeight, 4)
        .fillAndStroke(colors.cardBg, colors.border);

      const colWidth = usableWidth / 4;

      // Col 1: Topic
      doc
        .font('Helvetica-Bold')
        .fontSize(7)
        .fillColor(colors.mutedText)
        .text('RESEARCH TOPIC', margin + 12, metaCardY + 10, {
          width: colWidth - 16,
          characterSpacing: 0.5,
        });
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(colors.primaryText)
        .text(interview.topic || 'General Discovery', margin + 12, metaCardY + 23, {
          width: colWidth - 16,
          ellipsis: true,
        });

      // Col 2: Status
      const col2X = margin + colWidth;
      doc
        .font('Helvetica-Bold')
        .fontSize(7)
        .fillColor(colors.mutedText)
        .text('STATUS', col2X, metaCardY + 10, {
          width: colWidth - 16,
          characterSpacing: 0.5,
        });
      const isCompleted = interview.status === 'completed';
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(isCompleted ? colors.emerald : colors.teal)
        .text(isCompleted ? 'Completed' : 'Active', col2X, metaCardY + 23, {
          width: colWidth - 16,
        });

      // Col 3: Generated Date
      const col3X = margin + colWidth * 2;
      doc
        .font('Helvetica-Bold')
        .fontSize(7)
        .fillColor(colors.mutedText)
        .text('GENERATED DATE', col3X, metaCardY + 10, {
          width: colWidth - 16,
          characterSpacing: 0.5,
        });
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(colors.primaryText)
        .text(formatDate(report.generatedAt), col3X, metaCardY + 23, {
          width: colWidth - 16,
        });

      // Col 4: Transcript Stats
      const col4X = margin + colWidth * 3;
      doc
        .font('Helvetica-Bold')
        .fontSize(7)
        .fillColor(colors.mutedText)
        .text('TRANSCRIPT VOLUME', col4X, metaCardY + 10, {
          width: colWidth - 16,
          characterSpacing: 0.5,
        });
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(colors.primaryText)
        .text(`${transcriptCount} Messages`, col4X, metaCardY + 23, {
          width: colWidth - 16,
        });

      doc.y = metaCardY + metaCardHeight + 14;

      // ----------------------------------------------------
      // 3. EXECUTIVE SUMMARY
      // ----------------------------------------------------
      drawSectionHeading('Executive Summary');

      const summaryText = report.executiveSummary || 'No executive summary provided.';
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor('#1e293b')
        .text(summaryText, margin, doc.y, {
          width: usableWidth,
          lineGap: 3,
        });

      drawDivider(12, 14);

      // ----------------------------------------------------
      // 4. RESEARCH SIGNAL
      // ----------------------------------------------------
      drawSectionHeading('Research Signal');

      const signalCardY = doc.y;
      const signalCardHeight = 44;
      const signalCardWidth = (usableWidth - 16) / 2;

      // Box 1: Sentiment
      let sentimentBg = colors.slateBg;
      let sentimentBorder = colors.slateBorder;
      let sentimentColor = colors.secondaryText;
      const sentimentVal = (report.sentiment || 'neutral').toLowerCase();

      if (sentimentVal === 'positive') {
        sentimentBg = colors.emeraldBg;
        sentimentBorder = colors.emeraldBorder;
        sentimentColor = colors.emerald;
      } else if (sentimentVal === 'negative') {
        sentimentBg = colors.roseBg;
        sentimentBorder = colors.roseBorder;
        sentimentColor = colors.rose;
      }

      doc
        .roundedRect(margin, signalCardY, signalCardWidth, signalCardHeight, 4)
        .fillAndStroke(sentimentBg, sentimentBorder);

      doc
        .font('Helvetica-Bold')
        .fontSize(7)
        .fillColor(colors.mutedText)
        .text('OVERALL SENTIMENT', margin + 12, signalCardY + 9, {
          characterSpacing: 0.5,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(sentimentColor)
        .text(sentimentVal.toUpperCase(), margin + 12, signalCardY + 22);

      // Box 2: Interview Status
      const box2X = margin + signalCardWidth + 16;
      doc
        .roundedRect(box2X, signalCardY, signalCardWidth, signalCardHeight, 4)
        .fillAndStroke(colors.cardBg, colors.border);

      doc
        .font('Helvetica-Bold')
        .fontSize(7)
        .fillColor(colors.mutedText)
        .text('INTERVIEW STATUS', box2X + 12, signalCardY + 9, {
          characterSpacing: 0.5,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(isCompleted ? colors.emerald : colors.teal)
        .text(isCompleted ? 'COMPLETED' : 'ACTIVE', box2X + 12, signalCardY + 22);

      doc.y = signalCardY + signalCardHeight + 14;

      drawDivider(8, 14);

      // ----------------------------------------------------
      // 5. PAIN POINTS
      // ----------------------------------------------------
      drawSectionHeading('Pain Points');
      drawNumberedList(
        report.painPoints,
        'No explicit pain points were detected in this research session.',
        colors.rose,
        colors.roseBg
      );

      drawDivider(10, 14);

      // ----------------------------------------------------
      // 6. FEATURE REQUESTS
      // ----------------------------------------------------
      drawSectionHeading('Feature Requests');
      drawNumberedList(
        report.featureRequests,
        'No feature requests were extracted from this research session.',
        colors.teal,
        colors.tealBg
      );

      drawDivider(10, 14);

      // ----------------------------------------------------
      // 7. RECOMMENDATIONS
      // ----------------------------------------------------
      drawSectionHeading('Recommendations');
      drawNumberedList(
        report.recommendations,
        'No explicit recommendations derived.',
        colors.emerald,
        colors.emeraldBg
      );

      // ----------------------------------------------------
      // 8. DOCUMENT CLOSING SIGN-OFF
      // ----------------------------------------------------
      ensureSpace(40);
      drawDivider(12, 10);
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(colors.primaryText)
        .text('ProbeAI', margin, doc.y, { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(colors.mutedText)
        .text('AI-powered customer research', margin, doc.y + 2, { align: 'center' });

      // ----------------------------------------------------
      // 9. RUNNING HEADERS & FOOTERS ACROSS ALL BUFFERED PAGES
      // ----------------------------------------------------
      const range = doc.bufferedPageRange();
      const totalPages = range.count;

      for (let i = range.start; i < range.start + totalPages; i++) {
        doc.switchToPage(i);

        // Running top header on pages > 1
        if (i > 0) {
          doc
            .font('Helvetica-Bold')
            .fontSize(7)
            .fillColor(colors.teal)
            .text('PROBEAI', margin, 24, { continued: true, characterSpacing: 1 })
            .font('Helvetica')
            .fillColor(colors.mutedText)
            .text('   ·   Executive Research Report');

          doc
            .strokeColor(colors.border)
            .lineWidth(0.5)
            .moveTo(margin, 36)
            .lineTo(margin + usableWidth, 36)
            .stroke();
        }

        // Running bottom footer on every page
        const footerY = doc.page.height - 38;

        doc
          .strokeColor(colors.border)
          .lineWidth(0.5)
          .moveTo(margin, footerY - 8)
          .lineTo(margin + usableWidth, footerY - 8)
          .stroke();

        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor(colors.mutedText)
          .text('ProbeAI · Executive Research Report', margin, footerY, {
            width: usableWidth,
            align: 'left',
          });

        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor(colors.mutedText)
          .text(`Page ${i + 1} of ${totalPages}`, margin, footerY, {
            width: usableWidth,
            align: 'right',
          });
      }

      doc.end();
    });
  }
}

module.exports = new ReportPdfService();
