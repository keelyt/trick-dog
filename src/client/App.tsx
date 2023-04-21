import { Route, Routes } from 'react-router-dom';

import Navbar from './components/routing/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Decks from './pages/Decks';
import HomeLoggedIn from './pages/HomeLoggedIn';
import HomeLoggedOut from './pages/HomeLoggedOut';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import Study from './pages/Study';

import styles from './App.module.scss';

export default function App() {
  const { theme } = useTheme();
  // TODO: authed set to true for development--change to useAuth after implementing auth
  // const { authed } = useAuth();
  const authed = true;

  return (
    <div className={`theme--${theme}`}>
      <div className={styles.App}>
        <Navbar />
        <Routes>
          <Route path='/' element={authed ? <HomeLoggedIn /> : <HomeLoggedOut />} />
          <Route
            path='/decks'
            element={
              <PrivateRoute>
                <Decks />
              </PrivateRoute>
            }
          />
          <Route
            path='/study'
            element={
              <PrivateRoute>
                <Study />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}
