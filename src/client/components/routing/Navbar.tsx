import { FcGoogle } from 'react-icons/fc';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo-noBg.svg';
import { useAuth } from '../../contexts/AuthContext';
import DarkLightToggle from '../ui/DarkLightToggle';

import styles from './Navbar.module.scss';

export default function Navbar() {
  const { authed } = useAuth();

  // TODO: Use circle next to theme toggle for profile and login (profile picture if logged in, google icon if not)

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NavLink to='/' className={`${styles.nav__link} ${styles['nav__link--logo']}`}>
          <Logo className={styles.nav__logo} />
          Trick Dog
        </NavLink>
        <ul className={`${styles.nav__list} ${styles['nav__list--left']}`}>
          <li className={styles.skew}>
            <NavLink to='/' className={`${styles.nav__link} ${styles['nav__link--text']}`}>
              <span className={styles.unskew}>Home</span>
            </NavLink>
          </li>
          {authed && (
            <li className={styles.skew}>
              <NavLink to='/decks' className={`${styles.nav__link} ${styles['nav__link--text']}`}>
                <span className={styles.unskew}>Decks</span>
              </NavLink>
            </li>
          )}
          {authed && (
            <li className={styles.skew}>
              <NavLink to='/study' className={`${styles.nav__link} ${styles['nav__link--text']}`}>
                <span className={styles.unskew}>Study</span>
              </NavLink>
            </li>
          )}
          {authed && (
            <li className={styles.skew}>
              <NavLink to='/stats' className={`${styles.nav__link} ${styles['nav__link--text']}`}>
                <span className={styles.unskew}>Stats</span>
              </NavLink>
            </li>
          )}
        </ul>
        <ul className={`${styles.nav__list} ${styles['nav__list--right']}`}>
          {authed && (
            <li>
              <NavLink
                to='/profile'
                aria-label='Profile'
                className={`${styles.nav__link} ${styles['nav__link--icon']}`}
              >
                <FcGoogle aria-hidden='true' />
                {/* Profile */}
              </NavLink>
            </li>
          )}
          {!authed && (
            <li>
              <NavLink
                to='/login'
                aria-label='Login'
                className={`${styles.nav__link} ${styles['nav__link--icon']}`}
              >
                <FcGoogle aria-hidden='true' />
                Login
              </NavLink>
            </li>
          )}
          <li>
            <DarkLightToggle />
          </li>
        </ul>
      </nav>
    </div>
  );
}
