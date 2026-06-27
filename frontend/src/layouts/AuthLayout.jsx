import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="ds-ambient flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  );
}
