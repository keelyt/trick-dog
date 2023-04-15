// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';

import { ThemeContext } from './contexts/ThemeContext';

import styles from './App.module.scss';

export default function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`${styles.container} ${styles[`theme--${theme}`]}`}>
      <button className={styles.btn} type='button' onClick={toggleTheme}>
        Toggle
      </button>
      <div>hi</div>
    </div>
  );
}
