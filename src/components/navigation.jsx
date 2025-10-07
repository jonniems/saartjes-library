import { Link, useLocation } from 'react-router-dom';
// Iconen voor actieve en niet-actieve status
import HomeIcon from '../assets/icons/home.svg?react';
import HomeActiveIcon from '../assets/icons/home-active.svg?react';
import LibraryIcon from '../assets/icons/library.svg?react';
import LibraryActiveIcon from '../assets/icons/library-active.svg?react';
import HeartIcon from '../assets/icons/heart.svg?react';
import HeartActiveIcon from '../assets/icons/heart-active.svg?react';
import BookIcon from '../assets/icons/book.svg?react';
import BookActiveIcon from '../assets/icons/book-active.svg?react';
import HistoryIcon from '../assets/icons/history.svg?react';
import HistoryActiveIcon from '../assets/icons/history-active.svg?react';

const Navigation = () => {
  const location = useLocation(); // Verkrijg het huidige pad

  // Functie om de actieve status van de link te bepalen
  const isActive = (path) => location.pathname === path;

  return (
    <menu>
      <div className="library-menu">
        <Link to="/" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/') ? 'active' : ''}`}>
            {isActive('/') ? <HomeActiveIcon width="36px" height="36px"/> : <HomeIcon width="36px" height="36px"/>}
            <span>Home</span>
          </div>
        </Link>
        <Link to="/library" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/library') ? 'active' : ''}`}>
            {isActive('/library') ? <LibraryActiveIcon width="36px" height="36px"/> : <LibraryIcon width="36px" height="36px"/>}
            <span>Library</span>
          </div>
        </Link>
        <Link to="/wishlist" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/wishlist') ? 'active' : ''}`}>
            {isActive('/wishlist') ? <HeartActiveIcon width="36px" height="36px"/> : <HeartIcon width="36px" height="36px"/>}
            <span>Wishlist</span>
          </div>
        </Link>
        <Link to="/reading" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/reading') ? 'active' : ''}`}>
            {isActive('/reading') ? <BookActiveIcon width="36px" height="36px"/> : <BookIcon width="36px" height="36px"/>}
            <span>Reading</span>
          </div>
        </Link>
        <Link to="/history" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/history') ? 'active' : ''}`}>
            {isActive('/history') ? <HistoryActiveIcon width="36px" height="36px"/> : <HistoryIcon width="36px" height="36px"/>}
            <span>History</span>
          </div>
        </Link>
      </div>
    </menu>
  );
};

export default Navigation;
