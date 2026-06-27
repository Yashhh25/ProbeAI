export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="ds-glass-strong w-full max-w-md rounded-2xl p-8 shadow-elevated sm:p-10">
      <div className="mb-8 text-center">
        <p className="ds-brand mb-3">ProbeAI</p>
        <h1 className="ds-title sm:text-[1.75rem]">{title}</h1>
        {subtitle ? <p className="ds-body mt-2">{subtitle}</p> : null}
      </div>

      {children}

      {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
    </div>
  );
}
