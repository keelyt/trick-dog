import { FaSpinner } from 'react-icons/fa';

import styles from './LoadingSpinner.module.scss';

export default function LoadingSpinner() {
  return <FaSpinner className={styles.spinner} />;
}
