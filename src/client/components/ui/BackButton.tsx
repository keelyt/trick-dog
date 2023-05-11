import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import styles from './BackButton.module.scss';

export default function BackButton({ href, label }: { href: string; label: string }): JSX.Element {
  return (
    <Link to={href} className={styles.link}>
      <HiOutlineArrowLeft aria-hidden='true' />
      <span>{label}</span>
    </Link>
  );
}
