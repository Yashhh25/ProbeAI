import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateInterviewModal from '../components/interviews/CreateInterviewModal';
import InterviewCard from '../components/interviews/InterviewCard';
import InterviewEmptyState from '../components/interviews/InterviewEmptyState';
import useInterviews from '../hooks/useInterviews';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { setNavbarActions } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="flex items-center justify-center py-16">
        <p className="text-zinc-400">Loading interviews...</p>
      </div>
    );
  }

  return (
    <>
      {interviews.length === 0 ? (
        <InterviewEmptyState onCreateClick={openModal} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => (
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

      <CreateInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}