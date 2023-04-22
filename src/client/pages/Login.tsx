import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

import type { NavigateFunction, Location } from 'react-router-dom';

interface LocationState {
  path: string;
}

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  const navigate: NavigateFunction = useNavigate();
  const { login } = useAuth();
  const location: Location = useLocation();

  const handleLogin = () => {
    login()
      .then(() => navigate(location.state ? (location.state as LocationState).path : '/'))
      .catch((error: Error) => setError(error.message ?? 'Unable to log in.'));
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}
