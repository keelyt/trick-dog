import { ReactComponent as Logo } from '../assets/logo-noBg.svg';
import GoogleLoginButton from '../components/authentication/GoogleLoginButton';

import styles from './Home.module.scss';

export default function Home() {
  return (
    <main className={styles.content}>
      <div className={styles.text}>
        <h1 className={styles.heading}>Trick Dog</h1>
        <h2 className={styles.subheading}>Learn Fast, Learn Well</h2>
        <p className={styles.details}>
          Trick Dog&apos;s online flashcards help you master any subject though an intuitive and
          user-friendly interface. Whether you&apos;re studying for exams, learning a new language,
          or simply expanding your knowledge, our intelligent spaced repetition algorithm adapts to
          your individual learning pace, ensuring efficient and effective learning sessions. Take
          control of your education and unlock your full potential today!
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
