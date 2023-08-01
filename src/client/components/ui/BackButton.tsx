import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import styles from './BackButton.module.scss';

export default function BackButton({
  href,
  label,
  state,
}: {
  href: string;
  label: string;
  state?: Record<string, unknown>;
}): JSX.Element {
  return (
    <Link to={href} state={state} className={styles.link}>
      <HiOutlineArrowLeft aria-hidden='true' />
      <span>{label}</span>
    </Link>
  );
}
