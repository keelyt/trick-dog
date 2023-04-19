// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

import styles from './App.module.scss';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`${styles.container} ${styles[`theme--${theme}`]}`}>
      <button className={styles.btn} type='button' onClick={toggleTheme}>
        Toggle
      </button>
      <div>hi</div>
    </div>
  );
}
