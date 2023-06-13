import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

import type { Location } from 'react-router-dom';

interface LocationState {
  path: string;
}

/**
 * A component for rendering a public route that is only accessible to unauthenticated users.
 * @param children The optional child elements to be rendered.
 * @returns The rendered public route component.
 */
export default function PublicRoute({ children }: { children?: JSX.Element }): JSX.Element {
  const { authed } = useAuth();
  const location: Location = useLocation();

  // If the user is authenticated, redirect to the home page. Otherwise, render the child elements.
  if (authed)
    return (
      <Navigate
        to={
          location.pathname === '/login' && location.state && 'path' in location.state
            ? (location.state as LocationState).path
            : '/'
        }
        replace
      />
    );
  else return children ? children : <Outlet />;
}
