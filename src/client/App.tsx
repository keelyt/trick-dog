import { Route, Routes } from 'react-router-dom';

import Navbar from './components/routing/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import AddCard from './pages/AddCard';
import Decks from './pages/Decks';
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
            <Route path='/decks/:deckId' element={<EditDeck />} />
            <Route path='/decks/:deckId/cards/new' element={<AddCard />} />
            <Route path='/decks/:deckId/cards/:cardId' element={<EditCard />} />
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
