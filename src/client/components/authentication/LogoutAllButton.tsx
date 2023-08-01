import { useAuth } from '../../contexts/AuthContext';
import FormError from '../form/FormError';
import Button from '../ui/Button';

import styles from './LogoutAllButton.module.scss';

export default function LogoutAllButton(): JSX.Element {
  const { logoutAll } = useAuth();

  const handleLogout = () => {
    logoutAll.mutate();
  };

  return (
    <div className={styles.button}>
      <Button
        as='button'
        type='button'
        rounded={false}
        onClick={handleLogout}
        aria-disabled={logoutAll.isLoading}
        disabled={logoutAll.isLoading}
      >
        {logoutAll.isLoading ? 'Signing' : 'Sign'} Out Everywhere
      </Button>
      {logoutAll.isError && (
        <FormError
          errorMessage={
            logoutAll.error instanceof Error
              ? logoutAll.error.message
              : 'Unknown error. Please try again.'
          }
        />
      )}
    </div>
  );
}
