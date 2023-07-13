import { ReactComponent as Logo } from '../assets/logo-noBg.svg';
import GoogleLoginButton from '../components/authentication/GoogleLoginButton';

import styles from './HomeLoggedOut.module.scss';

export default function HomeLoggedOut() {
  return (
    <main className={styles.content}>
      <div className={styles.text}>
        <h1 className={styles.heading}>Trick Dog</h1>
        <h2 className={styles.subheading}>Learn Fast, Learn Well</h2>
        <p className={styles.details}>
          Trick Dog&apos;s online flashcards help you master any subject with its spaced repetition
          algorithm and efficient, intuitive interface.
        </p>
        <GoogleLoginButton />
      </div>
      <Logo className={styles.logo} />
      <a
        className={styles.github}
        href='https://github.com/keelyt/trick-dog'
        target='_blank'
        rel='noreferrer noopener'
      >
        View on GitHub
      </a>
    </main>
  );
}
