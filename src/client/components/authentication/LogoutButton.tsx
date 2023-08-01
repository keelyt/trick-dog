import { useAuth } from '../../contexts/AuthContext';
import FormError from '../form/FormError';
import Button from '../ui/Button';

import styles from './LogoutButton.module.scss';

export default function LogoutButton(): JSX.Element {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className={styles.button}>
      <Button
        as='button'
        type='button'
        rounded={false}
        onClick={handleLogout}
        aria-disabled={logout.isLoading}
        disabled={logout.isLoading}
      >
        {logout.isLoading ? 'Signing' : 'Sign'} Out
      </Button>
      {logout.isError && (
        <FormError
          errorMessage={
            logout.error instanceof Error
              ? logout.error.message
              : 'Unknown error. Please try again.'
          }
        />
      )}
    </div>
  );
}
