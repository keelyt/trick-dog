import { Navigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

/**
 * A component for rendering a public route that is only accessible to unauthenticated users.
 * @param children The child elements to be rendered.
 * @returns The rendered public route component.
 */
export default function PublicRoute({ children }: { children: JSX.Element }): JSX.Element {
  const { authed } = useAuth();

  // If the user is authenticated, redirect to the home page. Otherwise, render the child elements.
  return authed ? <Navigate to='/' replace /> : children;
}
