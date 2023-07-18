import { useRef, useState } from 'react';
import { BiUser } from 'react-icons/bi';

import LogoutAllButton from '../components/authentication/LogoutAllButton';
import LogoutButton from '../components/authentication/LogoutButton';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';

import styles from './Profile.module.scss';

export default function Profile() {
  const { userInfo, deleteUser } = useAuth();
  const [showPicture, setShowPicture] = useState<boolean>(true);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const btnDeleteRef = useRef<HTMLButtonElement>(null);

  const handleDeleteDialogCancel = () => {
    setDeleteModalIsOpen(false);
    btnDeleteRef.current?.focus();
  };

  const handleDeleteDialogOk = () => {
    deleteUser.mutate();
  };

  return (
    <main className={styles.content}>
      {deleteModalIsOpen && (
        <Modal onClose={handleDeleteDialogCancel}>
          <DeleteDialog
            onOk={handleDeleteDialogOk}
            onCancel={handleDeleteDialogCancel}
            title='Are you sure?'
            text='Are you sure you want to delete your account? Doing so will delete all of your decks. This cannot be undone.'
            okLabel={deleteUser.isLoading ? 'Deleting...' : 'Delete'}
            okDisabled={deleteUser.isLoading}
            {...(deleteUser.isError && {
              error:
                deleteUser.error instanceof Error
                  ? deleteUser.error.message
                  : 'An error occurred. Please try again.',
            })}
          />
        </Modal>
      )}
      <div className={styles.user}>
        <div className={styles.user__frame}>
          {showPicture && userInfo?.picture && (
            <img
              src={userInfo.picture}
              alt='Profile'
              referrerPolicy='no-referrer'
              onLoad={() => setShowPicture(true)}
              onError={() => setShowPicture(false)}
              className={styles.user__picture}
            />
          )}
          {(!showPicture || !userInfo || !userInfo.picture) && (
            <BiUser aria-hidden='true' focusable='false' />
          )}
        </div>
        <span className={styles.user__name}>{userInfo?.name}</span>
      </div>
      <div className={styles.settings}>
        <h1 className={styles.settings__heading}>Account Settings</h1>
        <div className={styles.settings__grid}>
          <span className={styles.settings__label}>Sign out on this device</span>
          <div className={styles.settings__button}>
            <LogoutButton />
          </div>
          <span className={styles.settings__label}>Sign out on all devices</span>
          <div className={styles.settings__button}>
            <LogoutAllButton />
          </div>
          <div className={styles.settings__label}>
            <span>Delete your account</span>
            <p className={styles.settings__warning}>Warning: This cannot be undone.</p>
          </div>
          <Button
            ref={btnDeleteRef}
            as='button'
            type='button'
            onClick={() => setDeleteModalIsOpen(true)}
            size='lg'
            rounded={false}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </main>
  );
}
