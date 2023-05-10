import { useEffect, useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { NavLink, useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo-noBg.svg';
import { useAuth } from '../../contexts/AuthContext';
import DarkLightToggle from '../ui/DarkLightToggle';

import styles from './Navbar.module.scss';

export default function Navbar(): JSX.Element {
  const { authed } = useAuth();
  const { pathname } = useLocation();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setShowNav(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]);

  const toggleNav = () => setShowNav((prevShowNav) => !prevShowNav);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NavLink to='/' className={`${styles.nav__link} ${styles['nav__link--logo']}`}>
          <Logo className={styles.nav__logo} />
          Trick Dog
        </NavLink>
        <button
          className={`${styles.nav__toggle} ${showNav ? styles.rotate : ''}`}
          onClick={toggleNav}
          aria-label={showNav ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={showNav}
          aria-controls='nav-menu'
        >
          {showNav ? (
            <RiCloseLine aria-hidden='true' focusable='false' />
          ) : (
            <RiMenuLine aria-hidden='true' focusable='false' />
          )}
        </button>
        <div
          id='nav-menu'
          className={`${styles.nav__menu} ${showNav ? '' : styles['nav__menu--collapsed']}`}
        >
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
                  <BiUser aria-hidden='true' focusable='false' />
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
                  <BiUser aria-hidden='true' focusable='false' />
                </NavLink>
              </li>
            )}
            <li>
              <DarkLightToggle />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
