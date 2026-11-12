import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useInterview from '../hooks/useInterview';
import useTranscript from '../hooks/useTranscript';
import useSendMessage from '../hooks/useSendMessage';
import useInterviewInsights from '../hooks/useInterviewInsights';
import useReport from '../hooks/useReport';
import useGenerateReport from '../hooks/useGenerateReport';
import ExecutiveReportModal from '../components/reports/ExecutiveReportModal';
import '../styles/premium-workspace.css';

const InsightsSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-3">
      <div className="h-4 w-28 bg-zinc-800 rounded shimmer-wave" />
      <div className="h-20 bg-zinc-900/50 border border-zinc-850 rounded-xl shimmer-wave" />
    </div>
    <div className="space-y-3">
      <div className="h-4 w-32 bg-zinc-800 rounded shimmer-wave" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-900/50 rounded shimmer-wave" />
        <div className="h-4 bg-zinc-900/50 rounded shimmer-wave w-5/6" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 w-36 bg-zinc-800 rounded shimmer-wave" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-900/50 rounded shimmer-wave w-4/5" />
        <div className="h-4 bg-zinc-900/50 rounded shimmer-wave w-2/3" />
      </div>
    </div>
  </div>
);

export default function InterviewPage() {
  const { id } = useParams();

  const [message, setMessage] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: interview,
  } = useInterview(id);

  const {
    data: transcript = [],
    isLoading: isTranscriptLoading,
  } = useTranscript(id);

  const {
    data: insights,
    isLoading: isInsightsLoading,
    isRefetching: isInsightsRefetching,
  } = useInterviewInsights(id);

  const {
    data: report,
  } = useReport(id);

  const sendMessageMutation = useSendMessage(id);
  const generateReportMutation = useGenerateReport(id);

  const isCompleted = interview?.status === 'completed';

  async function handleSubmit(event) {
    event.preventDefault();

    if (isCompleted) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setErrorMessage('');

    try {
      await sendMessageMutation.mutateAsync({
        role: 'user',
        content: trimmedMessage,
      });

      setMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to transmit response. Please try again.'
      );
    }
  }

  async function handleGenerateReport() {
    setErrorMessage('');
    try {
      await generateReportMutation.mutateAsync(id);
      setIsReportModalOpen(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to generate research report. Ensure there is participant data.'
      );
    }
  }

  function handleViewOrGenerateReport() {
    if (report) {
      setIsReportModalOpen(true);
    } else {
      handleGenerateReport();
    }
  }

  // Segmented progress stepper definitions
  const currentStep = transcript.length <= 1 ? 1 : transcript.length <= 3 ? 2 : transcript.length <= 5 ? 3 : transcript.length <= 7 ? 4 : 5;
  const steps = [
    { id: 1, label: 'Intro' },
    { id: 2, label: 'Explore' },
    { id: 3, label: 'Deep Dive' },
    { id: 4, label: 'Verify' },
    { id: 5, label: 'Synthesize' }
  ];

  // Dynamic discovery depth score calculation
  const depthScore = insights 
    ? Math.min(100, Math.round(insights.painPoints.length * 15 + insights.featureRequests.length * 15 + (insights.summary ? 25 : 0) + transcript.length * 2))
    : Math.min(100, transcript.length * 5);

  // SVG Circular Gauge configurations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (depthScore / 100) * circumference;

  return (
    <div className="relative flex h-[calc(100vh-140px)] flex-col select-none overflow-hidden rounded-2xl">
      {/* Background visual elements: mesh gradients and floating particles */}
      <div className="mesh-bg-container">
        <div className="mesh-orb-emerald" />
        <div className="mesh-orb-cyan" />
      </div>

      <div className="particles-container">
        {[...Array(12)].map((_, i) => {
          const style = {
            left: `${(i * 9) + 4}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${18 + (i % 3) * 5}s`,
            opacity: 0.08 + (i % 4) * 0.04
          };
          return <div key={i} className="particle" style={style} />;
        })}
      </div>

      {/* Top Workspace Header Bar */}
      <div className="glass-panel border-b border-zinc-800/60 p-4 shrink-0 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
                AI Research Session
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-cyan-500/10 text-[#5eead4] border-cyan-500/20'
              }`}>
                {isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>

            <h1 className="text-lg font-semibold text-white mt-1">
              {interview?.title || 'Qualitative Participant Discovery'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleViewOrGenerateReport}
            disabled={generateReportMutation.isPending}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-black bg-[#3ecfba] hover:bg-[#5eead4] transition cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(62,207,186,0.2)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {generateReportMutation.isPending
              ? 'Generating...'
              : report
              ? 'View Executive Report'
              : 'Generate Executive Report'}
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="font-mono text-zinc-500">PROBE-ACTIVE_WS</span>
          </div>
        </div>
      </div>

      {/* Application Alert Banner */}
      {errorMessage && (
        <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-rose-400 hover:text-white text-xs font-bold px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Research Console (Chat Timeline) */}
        <div className="lg:col-span-2 glass-panel flex flex-col overflow-hidden h-full">
          
          {/* Linear Progress Stepper */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/60 bg-zinc-950/20 shrink-0">
            <div className="flex items-center gap-2">
              <div className={`size-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-[#3ecfba] animate-pulse'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {isCompleted ? 'Session Complete' : 'Pipeline Progression'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3.5">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <div className={`h-1 w-5 md:w-8 rounded-full transition-all duration-500 ${
                    s.id <= (isCompleted ? 5 : currentStep)
                      ? 'progress-step-active' 
                      : 'bg-zinc-800'
                  }`} />
                  <span className={`text-[9px] uppercase tracking-wider font-bold ${
                    s.id === (isCompleted ? 5 : currentStep)
                      ? 'text-[#5eead4]' 
                      : s.id < (isCompleted ? 5 : currentStep)
                      ? 'text-zinc-500' 
                      : 'text-zinc-600'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Transcript Area with Timeline Tracks */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isTranscriptLoading ? (
              <div className="space-y-6 py-6">
                <div className="h-10 bg-zinc-900/50 rounded-xl shimmer-wave w-2/3" />
                <div className="h-12 bg-zinc-900/50 rounded-xl shimmer-wave w-1/2 ml-auto" />
                <div className="h-10 bg-zinc-900/50 rounded-xl shimmer-wave w-3/4" />
              </div>
            ) : transcript.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="size-12 rounded-full border border-zinc-800 flex items-center justify-center mb-3">
                  <div className="size-2 rounded-full bg-[#3ecfba] animate-ping" />
                </div>
                <p className="text-zinc-500 font-medium text-sm">
                  Workspace ready. Type a message below to initialize.
                </p>
              </div>
            ) : (
              <div className="relative pl-7 space-y-6">
                {/* Timeline vertical track line */}
                <div className="timeline-line" />
                
                {transcript.map((msg) => {
                  const isAI = msg.role === 'ai';
                  return (
                    <div 
                      key={msg._id} 
                      className={`relative group flex flex-col space-y-1.5 transition-all duration-300 ${
                        isAI 
                          ? 'ai-agent-console pl-4 py-2 rounded-r-lg' 
                          : 'user-response-card p-4 rounded-xl'
                      }`}
                    >
                      {/* Glowing vertical border for AI inquiries */}
                      {isAI && <div className="ai-agent-glow" />}
                      
                      {/* Timeline dot marker */}
                      <div className={`absolute left-[-23px] top-[14px] size-2.5 rounded-full border-2 transition-all duration-300 z-10 ${
                        isAI 
                          ? 'bg-zinc-950 border-[#3ecfba] shadow-[0_0_8px_rgba(62,207,186,0.5)]' 
                          : 'bg-zinc-950 border-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.3)]'
                      }`} />

                      <div className="flex items-center justify-between shrink-0">
                        <span className={`text-[9px] font-bold tracking-widest uppercase ${
                          isAI ? 'text-[#3ecfba]' : 'text-emerald-400'
                        }`}>
                          {isAI ? 'PROBE AGENT / RESEARCHER' : 'INTERVIEW PARTICIPANT'}
                        </span>
                        
                        <span className="text-[9px] text-zinc-500 select-none">
                          SEQ #{msg.sequenceNumber}
                        </span>
                      </div>

                      <p className={`text-sm leading-relaxed font-normal ${
                        isAI ? 'text-zinc-200' : 'text-white'
                      }`}>
                        {msg.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Input Terminal / Completion Card */}
          {isCompleted ? (
            <div className="border-t border-zinc-800/80 p-5 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba]">
                    RESEARCH COMPLETE
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">
                  This interview has been completed.
                </h4>
                <p className="text-xs text-zinc-400">
                  The participant's responses have been analyzed and your research report is ready to review.
                </p>
              </div>

              <button
                onClick={handleViewOrGenerateReport}
                disabled={generateReportMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-[#3ecfba] hover:bg-[#5eead4] text-black font-semibold text-xs transition cursor-pointer shrink-0 shadow-[0_0_15px_rgba(62,207,186,0.2)] disabled:opacity-50"
              >
                {generateReportMutation.isPending
                  ? 'Generating Report...'
                  : report
                  ? 'View Research Report'
                  : 'Generate Research Report'}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border-t border-zinc-800/60 p-4 bg-zinc-950/20"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type research answer response..."
                  disabled={sendMessageMutation.isPending}
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none focus:border-zinc-700 hover:border-zinc-700/60 transition disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={sendMessageMutation.isPending || !message.trim()}
                  className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-xs text-black cursor-pointer hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {sendMessageMutation.isPending ? 'TRANSMITTING...' : 'SEND RESPONSE'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Live Analysis & Insights */}
        <div className="lg:col-span-1 glass-panel flex flex-col overflow-hidden h-full rounded-b-2xl lg:rounded-tr-2xl lg:rounded-bl-none">
          
          {/* Insights Header */}
          <div className="border-b border-zinc-800/60 p-4 flex items-center justify-between shrink-0 bg-zinc-950/20">
            <h2 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
              Extraction Metrics
            </h2>
            
            {transcript.length > 0 && (
              <div className="flex items-center gap-2">
                {isInsightsRefetching ? (
                  <span className="text-[10px] text-zinc-500 animate-pulse font-medium">SYNTHESIZING...</span>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Live Analysis
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Insights Content Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* 1. Research Depth Score Card */}
            <div className="glass-panel-accent rounded-xl p-5 border border-zinc-800/40 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Discovery Depth</h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tracking-tight">{depthScore}%</span>
                  <span className="text-xs text-zinc-500 font-medium">/ 100</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium mt-1 leading-relaxed">
                  {depthScore < 30 ? 'Gathering initial context...' : depthScore < 60 ? 'Developing core themes...' : depthScore < 85 ? 'Strong research signal...' : 'Exhaustive data collected!'}
                </p>
              </div>
              
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <defs>
                    <linearGradient id="cyan-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5eead4" />
                      <stop offset="100%" stopColor="#3ecfba" />
                    </linearGradient>
                  </defs>
                  <circle className="depth-circle-bg" cx="32" cy="32" r={radius} />
                  <circle 
                    className="depth-circle-progress" 
                    cx="32" 
                    cy="32" 
                    r={radius} 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute text-[9px] font-bold tracking-widest text-[#3ecfba] uppercase">
                  {depthScore < 30 ? 'ALPHA' : depthScore < 60 ? 'BETA' : depthScore < 85 ? 'SIGMA' : 'OMNI'}
                </div>
              </div>
            </div>

            {/* Dedicated First-Class Report Banner Card */}
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-[#3ecfba]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Executive Report
                </span>

                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  report
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                }`}>
                  {report ? 'Report Ready' : 'Pending'}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {report
                  ? 'Comprehensive synthesis of findings, sentiment analysis, pain points, and strategic recommendations.'
                  : 'Synthesize transcript findings into an executive report for your research team.'}
              </p>

              <button
                onClick={handleViewOrGenerateReport}
                disabled={generateReportMutation.isPending}
                className="w-full rounded-xl bg-[#3ecfba] hover:bg-[#5eead4] text-black font-semibold py-2.5 text-xs transition cursor-pointer disabled:opacity-50"
              >
                {generateReportMutation.isPending
                  ? 'Generating Report...'
                  : report
                  ? 'View Executive Report'
                  : 'Generate Executive Report'}
              </button>
            </div>

            {/* 2. Extraction Outputs */}
            {isInsightsLoading ? (
              <InsightsSkeleton />
            ) : !insights ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-zinc-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3m-3.097-10.97a9.047 9.047 0 0115.014-4.067L21 9m0 0l-2 2m2-2h-5M3.75 20.25h16.5" />
                </svg>
                <h3 className="text-xs font-semibold text-zinc-300 mb-0.5">Awaiting insights</h3>
                <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">
                  Interviews are analyzed dynamically after responses are processed.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Sentiment & Summary */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tone Evaluation</span>
                    <span className={`ds-badge font-bold uppercase tracking-wider text-[9px] px-3 py-0.5 rounded-full border shadow-sm ${
                      insights.sentiment === 'positive'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5'
                        : insights.sentiment === 'negative'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 shadow-zinc-500/5'
                    }`}>
                      {insights.sentiment}
                    </span>
                  </div>

                  <div className="glass-card-hover bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/60">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Narrative Summary</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                      {insights.summary || 'No summary available yet.'}
                    </p>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-rose-400 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Pain Points
                  </h4>
                  
                  {insights.painPoints.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic pl-5 leading-normal">None detected yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {insights.painPoints.map((point, index) => (
                        <div 
                          key={index} 
                          className="glass-card-hover bg-zinc-900/20 rounded-lg p-3 border border-zinc-900/40 flex items-start gap-2.5"
                        >
                          <span className="text-rose-500/50 font-bold select-none text-xs mt-0.5">•</span>
                          <span className="text-sm text-zinc-300 leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feature Requests */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-[#3ecfba] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Feature Requests
                  </h4>
                  
                  {insights.featureRequests.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic pl-5 leading-normal">None detected yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {insights.featureRequests.map((req, index) => (
                        <div 
                          key={index} 
                          className="glass-card-hover bg-zinc-900/20 rounded-lg p-3 border border-zinc-900/40 flex items-start gap-2.5"
                        >
                          <span className="text-emerald-500/50 font-bold select-none text-xs mt-0.5">•</span>
                          <span className="text-sm text-zinc-300 leading-relaxed">{req}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={report}
        interview={interview}
        transcriptCount={transcript.length}
        onRegenerate={handleGenerateReport}
        isRegenerating={generateReportMutation.isPending}
      />
    </div>
  );
}