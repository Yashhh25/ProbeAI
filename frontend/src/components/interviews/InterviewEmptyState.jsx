import Button from '../ui/Button';

export default function InterviewEmptyState({ onCreateClick }) {
  return (
    <div className="ds-card flex flex-col items-center justify-center border-dashed px-6 py-16 text-center sm:py-20">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border ds-divider bg-accent-dim text-accent-bright">
        <svg
          className="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h8M8 14h5M6 20h12a2 2 0 002-2V8l-4-4H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h2 className="ds-heading">No research interviews yet</h2>
      <p className="ds-body mt-2 max-w-sm">
        Create your first AI-powered interview to start collecting customer
        feedback and market insights.
      </p>

      <Button className="mt-6" onClick={onCreateClick}>
        New Interview
      </Button>
    </div>
  );
}
