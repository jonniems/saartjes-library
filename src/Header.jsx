import { useState } from "react";
import { Link } from "react-router-dom";

import circlePlus from './assets/icons/circle-plus.svg';
import libraryIcon from './assets/icons/library.svg';
import heartIcon from './assets/icons/heart.svg';

function Header() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Toggle the popup visibility
  const handleButtonClick = () => {
    setIsPopupVisible((prevState) => !prevState); // Toggle the popup visibility
  };

  // Close the popup when a button is clicked
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <header>
      <div className="library-header-container">
        <div className="library-header-title">Saartje&apos;s Library</div>
        <div className="library-header-add-button">
          <button onClick={handleButtonClick}>
            {/* Rotate image when popup is visible */}
            <img
              src={circlePlus}
              alt="Add"
              className={isPopupVisible ? "rotate" : ""}
            />
          </button>
        </div>
      </div>

      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-container">
          <div className="popup-content">
            <div className="popup-buttons">
              <Link to="/add-book-library">
			        <button className="popup-button" onClick={closePopup}>                  
                  Add to Library
				          <img
                    src={libraryIcon}
                    alt="Library Icon"
                    className="popup-button-icon"
                  />
                </button>
              </Link>
              <Link to="/add-book-wishlist">
			        <button className="popup-button" onClick={closePopup}>
                  Add to Wishlist
				          <img
                    src={heartIcon}
                    alt="Library Icon"
                    className="popup-button-icon"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
