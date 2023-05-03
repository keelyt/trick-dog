import { BsXCircle } from 'react-icons/bs';

import Button from './Button';

import styles from './DeleteDialog.module.scss';

interface DeleteDialogProps {
  onOk: () => void;
  onCancel?: () => void;
  title: string;
  text: string;
}

export default function DeleteDialog({
  onOk,
  onCancel,
  title,
  text,
}: DeleteDialogProps): JSX.Element {
  return (
    <div
      className={styles.dialog}
      role='dialog'
      aria-labelledby='dialogTitle'
      aria-describedby='dialogDesc'
    >
      <BsXCircle className={styles.icon} aria-hidden='true' focusable='false' />
      <h2 className={styles.dialog__title} id='dialogTitle'>
        {title}
      </h2>
      <p className={styles.dialog__text} id='dialogDesc'>
        {text}
      </p>
      <div className={styles.dialog__buttons}>
        {onCancel && (
          <Button type='button' onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type='button' onClick={onOk}>
          Delete
        </Button>
      </div>
    </div>
  );
}
