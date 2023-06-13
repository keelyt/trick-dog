import { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import FormError from '../form/FormError';
import Button from '../ui/Button';

export default function LogoutButton(): JSX.Element {
  const { logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    try {
      await logout();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error. Please try again.');
    }
  };

  return (
    <div>
      <Button as='button' type='button' rounded={false} onClick={handleLogout}>
        Sign Out
      </Button>
      {error && <FormError errorMessage={error} />}
    </div>
  );
}
