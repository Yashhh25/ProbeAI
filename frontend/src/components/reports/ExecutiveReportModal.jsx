import { useState } from 'react';
import useDownloadReportPdf from '../../hooks/useDownloadReportPdf';

export default function ExecutiveReportModal({
  isOpen,
  onClose,
  report,
  interview,
  transcriptCount = 0,
  onRegenerate,
  isRegenerating = false,
}) {
  const [copied, setCopied] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const { downloadPdf, isDownloading } = useDownloadReportPdf();

  const handleDownloadPdf = async () => {
    const targetInterviewId = interview?._id || report?.interviewId;
    if (!targetInterviewId) {
      setDownloadError('Unable to identify interview for report download.');
      return;
    }

    setDownloadError('');
    try {
      await downloadPdf(targetInterviewId, interview?.title);
    } catch (err) {
      setDownloadError(err.message || 'Failed to download PDF report.');
    }
  };

  if (!isOpen || !report) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopySummary = () => {
    const textToCopy = `EXECUTIVE RESEARCH REPORT: ${interview?.title || 'Customer Interview'}
Topic: ${interview?.topic || 'N/A'}
Sentiment: ${report.sentiment || 'neutral'}
Generated: ${formatDate(report.generatedAt)}

EXECUTIVE SUMMARY:
${report.executiveSummary}

PAIN POINTS:
${report.painPoints?.map((p, i) => `${i + 1}. ${p}`).join('\n') || 'None recorded'}

FEATURE REQUESTS:
${report.featureRequests?.map((f, i) => `${i + 1}. ${f}`).join('\n') || 'None recorded'}

RECOMMENDATIONS:
${report.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'None recorded'}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sentimentStyles = {
    positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    negative: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    neutral: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden">

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#3ecfba]/10 border border-[#3ecfba]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-[#3ecfba]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba]">
                Executive Research Artifact
              </span>
              <h2 className="text-base font-semibold text-white">
                Research Report & Synthesis
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition disabled:opacity-50 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`size-3.5 ${isRegenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
            )}

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition disabled:opacity-50 cursor-pointer"
              title="Download Executive Report as PDF"
            >
              {isDownloading ? (
                <>
                  <svg className="size-3.5 animate-spin text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="size-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {downloadError && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{downloadError}</span>
            </div>
            <button
              onClick={() => setDownloadError('')}
              className="text-rose-400 hover:text-white text-xs font-bold px-2 py-0.5 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Metadata Banner */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {interview?.title || 'Customer Discovery Interview'}
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  <span className="font-semibold text-zinc-300">Topic:</span> {interview?.topic || 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  interview?.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {interview?.status === 'completed' ? 'Completed Session' : 'Active Session'}
                </span>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sentimentStyles[report.sentiment] || sentimentStyles.neutral}`}>
                  Sentiment: {report.sentiment || 'neutral'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-mono">Generated:</span>
                <span className="text-zinc-200 font-medium">{formatDate(report.generatedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-mono">Transcript Messages:</span>
                <span className="text-zinc-200 font-medium">{transcriptCount} entries</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-[#3ecfba]" />
              Executive Summary
            </h3>
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-sm leading-relaxed text-zinc-200">
              {report.executiveSummary || 'No executive summary provided.'}
            </div>
          </div>

          {/* Section 2 & 3: Grid of Pain Points & Feature Requests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Pain Points */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-rose-400" />
                  Pain Points
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  {report.painPoints?.length || 0} Identified
                </span>
              </div>

              {(!report.painPoints || report.painPoints.length === 0) ? (
                <p className="text-xs text-zinc-500 italic p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  No explicit pain points were detected in this transcript.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {report.painPoints.map((point, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-900/20 flex items-start gap-3"
                    >
                      <span className="flex items-center justify-center size-5 rounded-md bg-rose-500/10 text-rose-400 text-xs font-bold shrink-0 mt-0.5 border border-rose-500/20">
                        {index + 1}
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feature Requests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-[#3ecfba]" />
                  Feature Requests
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  {report.featureRequests?.length || 0} Identified
                </span>
              </div>

              {(!report.featureRequests || report.featureRequests.length === 0) ? (
                <p className="text-xs text-zinc-500 italic p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                  No feature requests were extracted from this transcript.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {report.featureRequests.map((req, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-900/20 flex items-start gap-3"
                    >
                      <span className="flex items-center justify-center size-5 rounded-md bg-[#3ecfba]/10 text-[#5eead4] text-xs font-bold shrink-0 mt-0.5 border border-[#3ecfba]/20">
                        {index + 1}
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {req}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Section 4: Strategic Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-400" />
                Strategic Recommendations
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                {report.recommendations?.length || 0} Action Items
              </span>
            </div>

            {(!report.recommendations || report.recommendations.length === 0) ? (
              <p className="text-xs text-zinc-500 italic p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                No explicit recommendations derived.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-3"
                  >
                    <div className="size-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Generated by ProbeAI Platform
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <svg className="size-3.5 animate-spin text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition cursor-pointer"
            >
              Close Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
