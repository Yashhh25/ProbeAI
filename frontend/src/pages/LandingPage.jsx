import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import '../styles/premium-workspace.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState('pm'); // pm, founder, uxr
  const [activeStep, setActiveStep] = useState(1); // 1 to 5 for pipeline stepper

  // Live Insights Preview data by persona
  const personaData = {
    pm: {
      title: "Product Manager Workspace",
      role: "Product Manager at Vercel",
      summary: "Users are reporting severe responsiveness latency when loading heavy datagrids in the dashboard view, resulting in onboarding friction.",
      sentiment: { positive: 45, neutral: 35, negative: 20 },
      painPoints: [
        { text: "Dashboard list rendering lag", relevance: 92, impact: "high" },
        { text: "Unclear data-filtering flow", relevance: 78, impact: "medium" },
        { text: "First-time setup guidance delay", relevance: 64, impact: "low" }
      ]
    },
    founder: {
      title: "Founder Workspace",
      role: "Co-Founder at Stripe",
      summary: "Early signups are experiencing friction during API credential onboarding, expressing concerns about subscription plan tiers transparency.",
      sentiment: { positive: 60, neutral: 25, negative: 15 },
      painPoints: [
        { text: "Pricing plan detail clarity", relevance: 88, impact: "high" },
        { text: "API credential activation latency", relevance: 74, impact: "high" },
        { text: "Missing developer SDK references", relevance: 58, impact: "medium" }
      ]
    },
    uxr: {
      title: "UX Research Workspace",
      role: "Lead UX Researcher at Linear",
      summary: "Accessibility assessments indicate that focus-states on nested menus fail minimum contrast requirements for mobile viewport layouts.",
      sentiment: { positive: 38, neutral: 42, negative: 20 },
      painPoints: [
        { text: "Mobile dropdown focus states visibility", relevance: 95, impact: "high" },
        { text: "Nested navigation click target size", relevance: 82, impact: "medium" },
        { text: "Screen reader skip-link structure", relevance: 68, impact: "low" }
      ]
    }
  };

  // Pipeline workflow definitions
  const pipelineSteps = [
    { id: 1, label: 'Intro', question: "Hello! Thanks for participating. Can you describe your primary day-to-day workflow with our dashboard?", meter: 15 },
    { id: 2, label: 'Explore', question: "You mentioned dashboards. What specific performance constraints or visual bugs do you encounter during peak hours?", meter: 40 },
    { id: 3, label: 'Deep Dive', question: "Interesting. When the datagrid lag occurs, how does that affect your team's reporting accuracy and operations?", meter: 65 },
    { id: 4, label: 'Verify', question: "Got it. If we provided a local-cache fallback to load records instantly, would that alleviate your latency concern?", meter: 85 },
    { id: 5, label: 'Synthesize', question: "Excellent! The session is complete. The AI agent is now synthesizing your feedback into pain points & themes.", meter: 100 }
  ];

  // Auto-progress pipeline step for visual dynamism
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === 5 ? 1 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentPersona = personaData[activePersona];

  return (
    <div className="ds-ambient min-h-screen text-zinc-100 flex flex-col font-sans select-none relative overflow-x-hidden">

      {/* Background Orbs & Particles */}
      <div className="mesh-bg-container">
        <div className="mesh-orb-emerald" />
        <div className="mesh-orb-cyan" />
      </div>

      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 7) + 3}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${14 + (i % 4) * 4}s`,
              opacity: 0.05 + (i % 3) * 0.03
            }}
          />
        ))}
      </div>

      {/* Header Navbar */}
      <header className="sticky top-0 z-50 ds-glass-strong border-b ds-divider px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="ds-brand text-base">ProbeAI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
          <a href="#live-preview" className="hover:text-white transition-colors">Live Preview</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Button size="sm" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-24 relative z-10">

        {/* Section 1: Hero */}
        <section className="text-center space-y-8 py-8 sm:py-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#3ecfba]/8 border border-[#3ecfba]/20 px-3.5 py-1 rounded-full animate-fade-in">
            <span className="size-2 rounded-full bg-[#3ecfba] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5eead4]">
              Autonomous Qualitative Research Platform
            </span>
          </div>

          <h1 className="ds-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
            Customer qualitative research, <span className="bg-gradient-to-r from-[#3ecfba] to-[#5eead4] bg-clip-text text-transparent">synthesized by AI</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
            Conduct human-like user interviews, transcribe feedback automatically, and compile analytics at scale. Built for Product Managers, UX Researchers, and Founders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="default" className="w-full sm:w-auto px-8" onClick={() => navigate('/register')}>
              Start Free Trial
            </Button>
            <a href="#live-preview" className="w-full sm:w-auto">
              <Button variant="secondary" size="default" className="w-full">
                Explore Live Demo
              </Button>
            </a>
          </div>

          {/* Interactive Screen Mockup (Linear / Stripe style) */}
          <div className="pt-12 animate-fade-in-up">
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 max-w-3xl mx-auto relative group">
              <div className="h-10 bg-zinc-950/80 border-b border-zinc-800/50 flex items-center px-4 justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-zinc-800" />
                  <div className="size-2.5 rounded-full bg-zinc-800" />
                  <div className="size-2.5 rounded-full bg-zinc-800" />
                </div>
                <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900/60 px-4 py-0.5 rounded border border-zinc-850">
                  probeai.app/workspace/session-083
                </div>
                <div className="size-3 text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 bg-zinc-950/40 min-h-[300px]">
                {/* Left Side: Mock chat console */}
                <div className="md:col-span-2 p-5 border-r border-zinc-800/40 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5">
                      <span className="size-5 rounded-full bg-[#3ecfba]/20 text-[#3ecfba] flex items-center justify-center text-[10px] font-bold">AI</span>
                      <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-r-xl rounded-bl-xl max-w-[85%]">
                        <p className="text-[10px] text-zinc-300 font-medium">How often do you face dashboard latency, and does it impact your onboarding flows?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-[#3ecfba]/12 border border-[#3ecfba]/25 p-2.5 rounded-l-xl rounded-br-xl max-w-[85%] text-right">
                        <p className="text-[10px] text-zinc-200 font-medium">Pretty much every morning. Users tell us that loading nested filters takes upwards of 8 seconds.</p>
                      </div>
                      <span className="size-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-semibold">U</span>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-2 border-t border-zinc-900 pt-3">
                    <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded px-2.5 py-1 text-[10px] text-zinc-500 flex items-center">
                      AI is formulating response...
                    </div>
                    <Button size="sm" disabled className="!py-1 !px-3 !text-[10px]">Send</Button>
                  </div>
                </div>
                {/* Right Side: Insights Summary panel */}
                <div className="p-5 text-left bg-zinc-950/60 space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-zinc-800/40 pb-2">
                    <span className="size-1.5 rounded-full bg-[#3ecfba] animate-pulse" />
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Real-time Synthesis</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-wide font-bold text-zinc-500 block mb-0.5">Top Pain Point</span>
                      <p className="text-[10px] text-white font-semibold">Dashboard nested loading lag (92% relevance)</p>
                      <div className="w-full bg-zinc-900 h-1 mt-1 rounded-full">
                        <div className="bg-[#3ecfba] h-1 rounded-full shadow-[0_0_6px_#3ecfba]" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wide font-bold text-zinc-500 block mb-0.5">Sentiment Map</span>
                      <div className="flex gap-1 items-center mt-1">
                        <span className="h-1.5 w-12 bg-[#3ecfba] rounded" />
                        <span className="h-1.5 w-8 bg-[#60a5fa] rounded" />
                        <span className="h-1.5 w-4 bg-[#fbbf24] rounded" />
                      </div>
                      <span className="text-[8px] text-[#3ecfba] font-bold block mt-1">Primary tone: POSITIVE (58%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features Grid */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
              Platform Capabilities
            </span>
            <h2 className="ds-title text-2xl sm:text-3xl text-white">Engineered for deep discovery.</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              We automate the heavy lifting of qualitative customer validation, saving you hundreds of hours of manual compilation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass-panel glass-card-hover rounded-2xl p-6 space-y-4">
              <div className="size-10 rounded-xl bg-[#3ecfba]/8 border border-[#3ecfba]/20 flex items-center justify-center text-[#5eead4]">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="ds-heading text-white">Autonomous Interviewing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide target topics, and the AI agent automatically guides the user through exploration, deep-dive, and verification stages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel glass-card-hover rounded-2xl p-6 space-y-4">
              <div className="size-10 rounded-xl bg-cyan-500/8 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <h3 className="ds-heading text-white">Instant Synthesis Dashboard</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Forget manually tagging recordings. Extract pain points, feature requests, and emotional sentiments automatically in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel glass-card-hover rounded-2xl p-6 space-y-4">
              <div className="size-10 rounded-xl bg-purple-500/8 border border-purple-500/20 flex items-center justify-center text-purple-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="ds-heading text-white">Workflow Telemetry</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Review progress steppers, dynamic discovery depth metrics, and high-fidelity activity logs tracking all background AI operations.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: How ProbeAI Works (Pipeline workflow preview) */}
        <section id="workflow" className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
              Pipeline Progression
            </span>
            <h2 className="ds-title text-2xl sm:text-3xl text-white">How the AI interview pipeline works.</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Our automated interviewer guides conversations through structured research stages to maintain discovery integrity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-5 relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-800 -translate-y-1/2 hidden md:block z-0" />

            {pipelineSteps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  className={[
                    'glass-panel rounded-xl p-4 flex flex-col justify-between min-h-[160px] text-left transition-all duration-300 relative z-10 border',
                    isActive
                      ? 'border-[#3ecfba]/40 bg-zinc-950/60 shadow-[0_0_20px_rgba(62,207,186,0.12)] scale-105'
                      : 'border-zinc-850 bg-zinc-900/20 opacity-70'
                  ].join(' ')}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-zinc-500">STAGE 0{step.id}</span>
                      <span className={`size-2 rounded-full ${isActive ? 'bg-[#3ecfba] animate-pulse' : 'bg-zinc-700'}`} />
                    </div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{step.label}</h4>
                    <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed italic">"{step.question}"</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/40">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Depth Gauge</span>
                    <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#3ecfba] h-1 rounded-full transition-all duration-500" style={{ width: `${step.meter}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Live Insights Preview (Interactive Persona Toggler) */}
        <section id="live-preview" className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
              Live Preview Workspace
            </span>
            <h2 className="ds-title text-2xl sm:text-3xl text-white">Interactive Insights Console</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Select a research role below to see simulated real-time intelligence reports generated by ProbeAI.
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex items-center justify-center gap-3">
            {[
              { id: 'pm', label: 'Product Manager' },
              { id: 'founder', label: 'Founder' },
              { id: 'uxr', label: 'UX Researcher' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePersona(tab.id)}
                className={[
                  'px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-300 outline-none',
                  activePersona === tab.id
                    ? 'border-[#3ecfba]/30 bg-[#3ecfba]/12 text-[#5eead4] shadow-[0_0_20px_rgba(62,207,186,0.08)]'
                    : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white hover:border-zinc-700'
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Report View */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-4xl mx-auto border border-zinc-800/80 shadow-2xl relative">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Left Column: Role Details & Summary */}
              <div className="space-y-5 text-left">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
                    {currentPersona.role}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{currentPersona.title}</h3>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-xl space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">AI Synthesis Executive Summary</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium italic">
                    "{currentPersona.summary}"
                  </p>
                </div>

                {/* Sentiment Distribution */}
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Sentiment breakdown</span>
                  <div className="flex h-3 w-full rounded-full overflow-hidden bg-zinc-900 border border-zinc-850 p-0.5">
                    <div className="bg-[#34d399] transition-all duration-500" style={{ width: `${currentPersona.sentiment.positive}%` }} />
                    <div className="bg-[#60a5fa] transition-all duration-500" style={{ width: `${currentPersona.sentiment.neutral}%` }} />
                    <div className="bg-[#fbbf24] transition-all duration-500" style={{ width: `${currentPersona.sentiment.negative}%` }} />
                  </div>
                  <div className="flex gap-4 text-[10px] text-zinc-400 font-semibold justify-center">
                    <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#34d399]" /> Positive ({currentPersona.sentiment.positive}%)</span>
                    <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#60a5fa]" /> Neutral ({currentPersona.sentiment.neutral}%)</span>
                    <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#fbbf24]" /> Negative ({currentPersona.sentiment.negative}%)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pain Points Metrics */}
              <div className="space-y-4 text-left">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Ranked Pain Points</span>

                <div className="space-y-3.5">
                  {currentPersona.painPoints.map((point, index) => (
                    <div
                      key={index}
                      className="bg-zinc-900/30 border border-zinc-850/60 p-3.5 rounded-xl hover:border-zinc-700/60 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-semibold text-white">{point.text}</span>
                        <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                          point.impact === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : point.impact === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-750'
                        }`}>
                          {point.impact} impact
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#3ecfba] h-full rounded-full transition-all duration-500" style={{ width: `${point.relevance}%` }} />
                        </div>
                        <span className="text-[9px] font-bold text-zinc-400 min-w-6 text-right">{point.relevance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 5: Testimonials Placeholders */}
        <section id="testimonials" className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
              Social Proof
            </span>
            <h2 className="ds-title text-2xl sm:text-3xl text-white">Validated by leading builders.</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Hear how teams at major technology organizations scale qualitative discovery pipelines.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote: "ProbeAI completely shifted our qualitative discovery timeline. Instead of manual codebooks and weeks of video editing, we get synthesized pain points in minutes.",
                author: "Sarah Jenkins",
                role: "Product Manager at Vercel",
                initials: "SJ"
              },
              {
                quote: "The autonomous interviewing module matches the quality of structured user interviews conducted by human researchers. It is highly responsive and adaptive.",
                author: "Alex Rivera",
                role: "Co-Founder at Stripe",
                initials: "AR"
              },
              {
                quote: "The dashboard is beautiful and the insights are highly actionable. Seeing the sentiment trends and pain points cluster saves us immense synthesis overhead.",
                author: "Elena Rostova",
                role: "UX Lead at Linear",
                initials: "ER"
              }
            ].map((t, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-6 flex flex-col justify-between text-left space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed font-medium italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-zinc-900 pt-4">
                  <div className="size-8 rounded-full bg-[#3ecfba]/12 border border-[#3ecfba]/20 text-[#5eead4] flex items-center justify-center text-xs font-bold font-mono">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{t.author}</h4>
                    <span className="text-[10px] text-zinc-500 font-semibold">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: CTA Banner */}
        <section className="relative">
          <div className="glass-panel glass-panel-accent rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto relative overflow-hidden space-y-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ecfba]/5 to-[#5eead4]/5 z-0 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to synthesize qualitative research?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-medium">
                Join founders, product managers, and researchers currently unlocking insights. Set up your first autonomous interview in 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="default" className="w-full sm:w-auto px-8" onClick={() => navigate('/register')}>
                  Start Free Trial
                </Button>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" size="default" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t ds-divider py-8 mt-12 bg-zinc-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="ds-brand text-xs">ProbeAI</span>
            <span>© 2026 ProbeAI. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Process</a>
            <a href="#live-preview" className="hover:text-white transition-colors">Demo</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
