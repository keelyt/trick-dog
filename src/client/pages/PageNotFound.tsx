import { ReactComponent as Logo } from '../assets/logo-noBg.svg';

import styles from './PageNotFound.module.scss';

export default function PageNotFound() {
  return (
    <main role='main' className={styles.container}>
      <Logo className={styles.logo} />
      <div>
        <h1>404 Error</h1>
        <h2>Page Not Found</h2>
        <h3>Doggone It</h3>
      </div>
    </main>
  );
}
