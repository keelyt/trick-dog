import { useEffect, useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { NavLink, useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo-noBg.svg';
import { useAuth } from '../../contexts/AuthContext';
import useScrollListener from '../../helpers/useScrollListener';
import DarkLightToggle from '../ui/DarkLightToggle';

import styles from './Navbar.module.scss';

export default function Navbar(): JSX.Element {
  const { authed, userInfo } = useAuth();
  const { pathname } = useLocation();
  // menuExpanded indicates whether the mobile nav menu is expanded (true) or collapsed (false).
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
  // navbarHidden indicates whether the top navbar is hidden because the user has scrolled down.
  const [navbarHidden, setNavbarHidden] = useState<boolean>(false);
  // showPicture indicates whether the user's profile picture (true) or the default
  // profile picture (false) should be used.
  const [showPicture, setShowPicture] = useState<boolean>(true);

  const scroll = useScrollListener(150);

  useEffect(() => {
    if (scroll.y > 150 && scroll.y - scroll.prevY > 0 && authed) setNavbarHidden(true);
    else setNavbarHidden(false);
  }, [scroll.y, scroll.prevY]);

  // Remove focus from nav link when path changes.
  useEffect(() => {
    setMenuExpanded(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]);

  const toggleNav = () => setMenuExpanded((prevMenuExpanded) => !prevMenuExpanded);

  return (
    <div className={`${styles.navbar} ${navbarHidden ? styles['navbar--hidden'] : ''}`}>
      <nav className={styles.nav}>
        <NavLink to='/' className={`${styles.nav__link} ${styles['nav__link--logo']}`}>
          <Logo className={styles.nav__logo} />
          Trick Dog
        </NavLink>
        {authed && (
          <button
            className={`${styles.nav__toggle} ${menuExpanded ? styles.rotate : ''}`}
            onClick={toggleNav}
            aria-label={menuExpanded ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuExpanded}
            aria-controls='nav-menu'
          >
            {menuExpanded ? (
              <RiCloseLine aria-hidden='true' focusable='false' />
            ) : (
              <RiMenuLine aria-hidden='true' focusable='false' />
            )}
          </button>
        )}
        <div
          id='nav-menu'
          className={`${styles.nav__menu} ${authed ? styles['nav__menu--collapsible'] : ''} ${
            authed && !menuExpanded ? styles['nav__menu--collapsed'] : ''
          }`}
        >
          <ul
            className={`${styles.nav__list} ${authed ? styles['nav__list--collapsible'] : ''} ${
              authed ? styles['nav__list--left-collapsible'] : styles['nav__list--left']
            }`}
          >
            {authed && (
              <li className={styles.skew}>
                <NavLink to='/' className={`${styles.nav__link} ${styles['nav__link--text']}`}>
                  <span className={styles.unskew}>Home</span>
                </NavLink>
              </li>
            )}
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
          <ul
            className={`${styles.nav__list} ${authed ? styles['nav__list--collapsible'] : ''} ${
              authed ? styles['nav__list--right-collapsible'] : styles['nav__list--right']
            }`}
          >
            {authed && (
              <li>
                <NavLink
                  to='/profile'
                  aria-label='Profile'
                  className={`${styles.nav__link} ${styles['nav__link--icon']}`}
                >
                  {showPicture && userInfo?.picture && (
                    <img
                      src={userInfo.picture}
                      alt='Profile'
                      referrerPolicy='no-referrer'
                      onLoad={() => setShowPicture(true)}
                      onError={() => setShowPicture(false)}
                      className={styles.picture}
                    />
                  )}
                  {(!showPicture || !userInfo || !userInfo.picture) && (
                    <BiUser aria-hidden='true' focusable='false' />
                  )}
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
