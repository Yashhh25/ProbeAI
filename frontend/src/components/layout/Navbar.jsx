import Button from '../ui/Button';

export default function Navbar({ title, onMenuClick, onNewInterview }) {
  return (
    <header className="ds-glass-strong sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b ds-divider px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="ds-btn-ghost inline-flex !p-2 lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="ds-heading truncate sm:text-xl">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <Button size="sm" onClick={onNewInterview}>
          New Interview
        </Button>

        <div
          className="flex size-9 items-center justify-center rounded-full border ds-divider bg-white/5 text-fg-secondary transition hover:border-border-hover hover:bg-white/8"
          aria-label="User avatar"
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
