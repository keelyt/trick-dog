import { RiErrorWarningLine } from 'react-icons/ri';

import styles from './ValidationError.module.scss';

export default function ValidationError({ errorMessage }: { errorMessage: string }) {
  return (
    <div className={styles.error} role='alert'>
      <RiErrorWarningLine aria-hidden='true' />
      {errorMessage}
    </div>
  );
}
