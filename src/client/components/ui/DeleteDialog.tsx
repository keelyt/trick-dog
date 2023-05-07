import { BsXCircle } from 'react-icons/bs';

import Button from './Button';

import styles from './DeleteDialog.module.scss';

interface DeleteDialogProps {
  onOk: () => void;
  onCancel?: () => void;
  title: string;
  text: string;
  okLabel?: string;
  cancelLabel?: string;
  okDisabled: boolean;
}

export default function DeleteDialog({
  onOk,
  onCancel,
  title,
  text,
  okLabel = 'Delete',
  cancelLabel = 'Cancel',
  okDisabled = false,
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
          <Button as='button' type='button' onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button as='button' type='button' onClick={onOk} disabled={okDisabled}>
          {okLabel}
        </Button>
      </div>
    </div>
  );
}
