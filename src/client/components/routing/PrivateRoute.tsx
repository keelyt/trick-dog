import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

/**
 * A component for rendering a private route that is only accessible to authenticated users.
 * @param children The child elements to be rendered.
 * @returns The rendered private route component.
 */
export default function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  const { authed } = useAuth();
  const location = useLocation();

  // If the user is authenticated, render the child elements. Otherwise, redirect to the login page.
  return authed ? children : <Navigate to='/login' replace state={{ path: location.pathname }} />;
}
