import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';

import { useTheme } from '../../contexts/ThemeContext';

import styles from './DarkLightToggle.module.scss';

export default function DarkLightToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Activate dark mode' : 'Activate light mode'}
      className={`${styles.btn} ${theme === 'dark' ? styles.rotate : ''}`}
    >
      {theme === 'light' ? (
        <RiMoonClearLine aria-hidden='true' focusable='false' />
      ) : (
        <RiSunLine aria-hidden='true' focusable='false' />
      )}
    </button>
  );
}
