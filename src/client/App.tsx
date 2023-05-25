import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/routing/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import AddCard from './pages/AddCard';
import DeckCards from './pages/DeckCards';
import Decks from './pages/Decks';
import DeckSettings from './pages/DeckSettings';
import DeckTags from './pages/DeckTags';
import EditCard from './pages/EditCard';
import EditDeck from './pages/EditDeck';
import HomeLoggedIn from './pages/HomeLoggedIn';
import HomeLoggedOut from './pages/HomeLoggedOut';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Study from './pages/Study';

import styles from './App.module.scss';

export default function App() {
  const { theme } = useTheme();
  const { authed } = useAuth();

  return (
    <div className={`theme--${theme}`}>
      <div className={styles.App}>
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
      </div>
    </div>
  );
}
