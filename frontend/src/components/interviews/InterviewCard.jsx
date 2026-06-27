import Badge from '../ui/Badge';
import Button from '../ui/Button';

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function InterviewCard({
  title,
  topic,
  status,
  createdAt,
  onOpen,
}) {
  return (
    <article className="ds-card ds-card-interactive flex flex-col p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="ds-heading truncate">{title}</h2>
          <p className="ds-body mt-1">{topic}</p>
        </div>
        <Badge variant={status}>{formatStatus(status)}</Badge>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 border-t ds-divider pt-4">
        <p className="ds-caption">Created {formatDate(createdAt)}</p>
        <Button variant="secondary" size="sm" onClick={onOpen}>
          Open
        </Button>
      </div>
    </article>
  );
}
