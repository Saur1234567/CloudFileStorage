import { Navigate, useLocation } from 'react-router-dom';

// Wrap any route that requires a logged-in user (dashboard, drive, etc.).
// Without this, every page was reachable directly by URL even with no token.
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('drivex-token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// Wrap auth pages (login/register) so an already-logged-in user skips
// straight back to the dashboard instead of seeing the login form again.
export function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem('drivex-token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
