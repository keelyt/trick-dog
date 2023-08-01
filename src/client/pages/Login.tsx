import { ReactComponent as Logo } from '../assets/logo-noBg.svg';
import GoogleLoginButton from '../components/authentication/GoogleLoginButton';

import styles from './Login.module.scss';

export default function Login(): JSX.Element {
  return (
    <main className={styles.content}>
      <Logo className={styles.logo} />
      <span className={styles.heading}>Trick Dog</span>
      <span className={styles.subheading}>Learn Fast, Learn Well</span>
      <hr className={styles.divider} />
      <span className={styles.text}>Sign in to continue</span>
      <GoogleLoginButton />
    </main>
  );
}
