import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

function getPageTitle(pathname) {
  if (pathname.startsWith('/interview')) {
    return 'Interview';
  }

  if (pathname.startsWith('/analytics')) {
    return 'Analytics';
  }

  if (pathname.startsWith('/interviews')) {
    return 'Interviews';
  }

  return 'Dashboard';
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navbarActions, setNavbarActions] = useState({});

  const handleSetNavbarActions = useCallback((actions) => {
    setNavbarActions(actions);
  }, []);

  return (
    <div className="ds-ambient min-h-svh">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <Navbar
          title={getPageTitle(pathname)}
          onMenuClick={() => setIsSidebarOpen(true)}
          onNewInterview={navbarActions.onNewInterview}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet context={{ setNavbarActions: handleSetNavbarActions }} />
        </main>
      </div>
    </div>
  );
}
