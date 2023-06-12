import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/routing/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

const AddCard = lazy(() => import('./pages/AddCard'));
const DeckCards = lazy(() => import('./pages/DeckCards'));
const Decks = lazy(() => import('./pages/Decks'));
const DeckSettings = lazy(() => import('./pages/DeckSettings'));
const DeckTags = lazy(() => import('./pages/DeckTags'));
const EditCard = lazy(() => import('./pages/EditCard'));
const EditDeck = lazy(() => import('./pages/EditDeck'));
const HomeLoggedIn = lazy(() => import('./pages/HomeLoggedIn'));
const HomeLoggedOut = lazy(() => import('./pages/HomeLoggedOut'));
const Login = lazy(() => import('./pages/Login'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Profile = lazy(() => import('./pages/Profile'));
const Stats = lazy(() => import('./pages/Stats'));
const Study = lazy(() => import('./pages/Study'));

import styles from './App.module.scss';

export default function App() {
  const { theme } = useTheme();
  const { authed } = useAuth();

  return (
    <div className={`theme--${theme}`}>
      <div className={styles.App}>
        {authed === null ? (
          <Fallback />
        ) : (
          <Suspense fallback={<Fallback />}>
            <Navbar />
            <Routes>
              <Route path='/' element={authed ? <HomeLoggedIn /> : <HomeLoggedOut />} />
              <Route element={<PrivateRoute />}>
                <Route path='/decks' element={<Decks />} />
                <Route path='/decks/:deckId' element={<EditDeck />}>
                  <Route index element={<Navigate to='cards' replace />} />
                  <Route path='cards' element={<DeckCards />} />
                  <Route path='cards/new' element={<AddCard />} />
                  <Route path='cards/:cardId' element={<EditCard />} />
                  <Route path='tags' element={<DeckTags />} />
                  <Route path='settings' element={<DeckSettings />} />
                </Route>
                <Route path='/study' element={<Study />} />
                <Route path='/stats' element={<Stats />} />
                <Route path='/profile' element={<Profile />} />
              </Route>
              <Route element={<PublicRoute />}>
                <Route path='/login' element={<Login />} />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Suspense>
        )}
      </div>
    </div>
  );
}

const Fallback = () => {
  return (
    <div className={styles.loading}>
      <LoadingSpinner />
    </div>
  );
};
