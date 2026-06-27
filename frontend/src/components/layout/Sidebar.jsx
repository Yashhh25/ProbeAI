import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Interviews', to: '/interviews' },
  { label: 'Analytics', to: '/analytics' },
];

function navLinkClassName({ isActive }) {
  return isActive ? 'ds-nav-link ds-nav-link-active' : 'ds-nav-link';
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-void/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[
          'ds-glass-strong fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-16 items-center border-b ds-divider px-6">
          <span className="ds-brand">ProbeAI</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClassName}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t ds-divider p-4">
          <p className="ds-caption px-3">AI-powered research</p>
        </div>
      </aside>
    </>
  );
}
