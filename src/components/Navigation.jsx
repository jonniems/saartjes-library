import { Link, useLocation } from 'react-router-dom';
// Iconen voor actieve en niet-actieve status
import homeIcon from '../assets/icons/home.svg';
import homeActiveIcon from '../assets/icons/home-active.svg';
import libraryIcon from '../assets/icons/library.svg';
import libraryActiveIcon from '../assets/icons/library-active.svg';
import heartIcon from '../assets/icons/heart.svg';
import heartActiveIcon from '../assets/icons/heart-active.svg';
import bookIcon from '../assets/icons/book.svg';
import bookActiveIcon from '../assets/icons/book-active.svg';
import historyIcon from '../assets/icons/history.svg';
import historyActiveIcon from '../assets/icons/history-active.svg';

const Navigation = () => {
  const location = useLocation(); // Verkrijg het huidige pad

  // Functie om de actieve status van de link te bepalen
  const isActive = (path) => location.pathname === path;

  return (
    <menu>
      <div className="library-menu">
        <Link to="/" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/') ? 'active' : ''}`}>
            <img src={isActive('/') ? homeActiveIcon : homeIcon} alt="Home" />
            <span>Home</span>
          </div>
        </Link>
        <Link to="/library" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/library') ? 'active' : ''}`}>
            <img src={isActive('/library') ? libraryActiveIcon : libraryIcon} alt="Library" />
            <span>Library</span>
          </div>
        </Link>
        <Link to="/wishlist" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/wishlist') ? 'active' : ''}`}>
            <img src={isActive('/wishlist') ? heartActiveIcon : heartIcon} alt="Wishlist" />
            <span>Wishlist</span>
          </div>
        </Link>
        <Link to="/reading" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/reading') ? 'active' : ''}`}>
            <img src={isActive('/reading') ? bookActiveIcon : bookIcon} alt="Reading" />
            <span>Reading</span>
          </div>
        </Link>
        <Link to="/history" className="library-menu-link">
          <div className={`library-menu-item ${isActive('/history') ? 'active' : ''}`}>
            <img src={isActive('/history') ? historyActiveIcon : historyIcon} alt="History" />
            <span>History</span>
          </div>
        </Link>
      </div>
    </menu>
  );
};

export default Navigation;
