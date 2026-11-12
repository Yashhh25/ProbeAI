import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateInterviewModal from '../components/interviews/CreateInterviewModal';
import InterviewCard from '../components/interviews/InterviewCard';
import InterviewEmptyState from '../components/interviews/InterviewEmptyState';
import useInterviews from '../hooks/useInterviews';
import Input from '../components/ui/Input';
import '../styles/premium-workspace.css';

export default function InterviewsPage() {
  const navigate = useNavigate();
  const { setNavbarActions } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed

  const {
    data: interviews = [],
    isLoading,
  } = useInterviews();

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    setNavbarActions({
      onNewInterview: openModal,
    });

    return () => setNavbarActions({});
  }, [setNavbarActions, openModal]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="ds-spinner ds-spinner-light !size-8" aria-hidden="true" />
          <p className="text-zinc-400 font-medium">Loading research repository...</p>
        </div>
      </div>
    );
  }

  // Filter & Search logic
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.topic?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      interview.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-[calc(100vh-140px)] rounded-2xl overflow-hidden p-6 sm:p-8">
      {/* Mesh gradients & particles for premium design consistency */}
      <div className="mesh-bg-container">
        <div className="mesh-orb-emerald" />
        <div className="mesh-orb-cyan" />
      </div>

      <div className="particles-container">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 10) + 5}%`,
              animationDelay: `${i * 1.8}s`,
              animationDuration: `${15 + (i % 3) * 6}s`,
              opacity: 0.05 + (i % 4) * 0.03
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3ecfba] bg-[#3ecfba]/8 px-2 py-0.5 rounded-full">
              Research Repository
            </span>
            <h1 className="text-2xl font-semibold text-white mt-1">Interviews & Sessions</h1>
            <p className="ds-body mt-1 text-zinc-400">
              Manage your qualitative customer discovery and active user feedback sessions.
            </p>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="py-12">
            <InterviewEmptyState onCreateClick={openModal} />
          </div>
        ) : (
          <>
            {/* Filters and Search toolbar */}
            <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-80 relative">
                <Input
                  placeholder="Search by title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="!pl-9 bg-zinc-950/40 border-zinc-800"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Tabs */}
              <div className="flex border border-zinc-800 bg-zinc-950/60 p-1 rounded-lg self-stretch md:self-auto">
                {[
                  { id: 'all', label: 'All Sessions' },
                  { id: 'active', label: 'Active' },
                  { id: 'completed', label: 'Completed' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={[
                      'px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 outline-none',
                      statusFilter === tab.id
                        ? 'bg-[#3ecfba]/12 text-[#5eead4] border border-[#3ecfba]/20 shadow-[0_0_12px_rgba(62,207,186,0.06)]'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40 border border-transparent'
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interviews Grid */}
            {filteredInterviews.length === 0 ? (
              <div className="glass-panel border-dashed rounded-xl py-16 text-center">
                <p className="text-zinc-400">No interviews match your search and filter criteria.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredInterviews.map((interview) => (
                  <InterviewCard
                    key={interview._id}
                    title={interview.title}
                    topic={interview.topic}
                    status={interview.status}
                    createdAt={interview.createdAt}
                    onOpen={() => navigate(`/interview/${interview._id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
