import { useState } from "react";
import { Link } from "react-router-dom";

import CirclePlus from "../assets/icons/circle-plus.svg?react";
import LibraryIcon from "../assets/icons/library.svg?react";
import HeartIcon from "../assets/icons/heart.svg?react";
import { useVisitorMode } from "../context/useVisitorMode.js";

function Header() {
  const { isFriend } = useVisitorMode();
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
        {!isFriend && (
          <div className="library-header-add-button">
            <button onClick={handleButtonClick}>
              {/* Rotate image when popup is visible */}
              <CirclePlus
                alt="Add"
                style={{ width: "36px", height: "36px" }}
                className={isPopupVisible ? "rotate" : ""}
              />
            </button>
          </div>
        )}
      </div>

      {/* Popup */}
      {!isFriend && isPopupVisible && (
        <div className="popup-container">
          <div className="popup-content">
            <div className="popup-buttons">
              <Link to="/add-book-library">
                <button className="popup-button" onClick={closePopup}>
                  Add to Library
                  <LibraryIcon
                    alt="Library Icon"
                    className="popup-button-icon"
                    style={{ width: "24px", height: "24px" }}
                  />
                </button>
              </Link>
              <Link to="/add-book-wishlist">
                <button className="popup-button" onClick={closePopup}>
                  Add to Wishlist
                  <HeartIcon
                    alt="Library Icon"
                    className="popup-button-icon"
                    style={{ width: "24px", height: "24px" }}
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
