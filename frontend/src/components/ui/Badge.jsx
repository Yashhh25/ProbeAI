const variants = {
  draft: 'ds-badge-draft',
  active: 'ds-badge-active',
  completed: 'ds-badge-completed',
  paused: 'ds-badge-paused',
};

export default function Badge({ children, variant = 'draft', className = '' }) {
  return (
    <span className={['ds-badge', variants[variant] ?? variants.draft, className].join(' ')}>
      {children}
    </span>
  );
}
