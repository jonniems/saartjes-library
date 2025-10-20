import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// 1. Importeer de custom hook voor data en logica
import { useBookDetails } from "../hooks/useBookDetails.js"; 
// 2. Importeer de nieuwe modale componenten
import StartReadingModal from "../components/StartReadingModal.jsx";
import StopReadingModal from "../components/StopReadingModal.jsx";
import RemoveConfirmModal from "../components/RemoveConfirmModal.jsx";

import BackIcon from "../assets/icons/back.svg?react";

const LibraryBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 3. HAAL DATA EN ACTIES OP VIA DE HOOK
  const {
    book,
    loading,
    error,
    confirmStartReading,
    handleSubmitPopup,
    confirmRemoveFromLibrary,
    handleRemoveFromWishlist,
    handleAddToLibrary,
    handleCheckOnBol,
  } = useBookDetails(id, navigate);

  // 4. MODAL STATE: Beheer alleen de zichtbaarheid van de modals
  const [showStopReadingPopup, setShowStopReadingPopup] = useState(false); // Vroeger 'showPopup'
  const [showStartReadingPopup, setShowStartReadingPopup] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  // UI Effect: Beheer de body class wanneer een modal open is
  useEffect(() => {
    const anyModalOpen =
      showStopReadingPopup || showRemoveConfirm || showStartReadingPopup;
    document.body.classList.toggle("overlay-open", anyModalOpen);
    return () => {
      document.body.classList.remove("overlay-open");
    };
  }, [showStopReadingPopup, showRemoveConfirm, showStartReadingPopup]);


  // HULPFUNCTIES: Alleen de presentatielogica blijft over
  const renderRating = (rating) => {
    const totalCircles = 5;
    const filledCircles = rating
      ? Math.min(Math.max(rating, 1), totalCircles)
      : 0;

    const circles = [];
    for (let i = 1; i <= totalCircles; i++) {
      circles.push(
        <span
          key={i}
          className={i <= filledCircles ? "filled-circle" : "unfilled-circle"}
        ></span>
      );
    }
    return circles;
  };


  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error loading book details: {error}</p>;
  if (!book) return <p>Book not found.</p>;

  // RENDEREN:
  return (
    <div>
      <div className="book-details-container">
        <div className="go-back">
          <Link onClick={handleGoBack}>
            <BackIcon alt="Back" style={{ width: "12px", height: "12px" }} />
            <span>go back</span>
          </Link>
        </div>
        <h1>{book.title}</h1>
        <h3>{book.author}</h3>
        <div className="book-details-genre">
          {book.is_fiction ? "Fiction" : "Non-Fiction"}
        </div>
        <hr />
        
        {/* SUMMARY DETAILS */}
        {book.in_library && (
          <div className="book-details-summary">
            <div className="book-details-dates">
              In library since: {book.in_library_from}
            </div>
            <div className="book-details-dates">
              Started reading on:{" "}
              {book.start_reading ? book.start_reading : "-"}
            </div>
            <div className="book-details-dates">
              Finished reading on: {book.end_reading ? book.end_reading : "-"}
            </div>
            <div className="book-details-rating">
              Rating: {renderRating(book.rating)}
            </div>
          </div>
        )}

        {/* WISHLIST BUTTONS */}
        {book.on_wishlist && (
          <div className="wishlist-buttons">
            <button className="main-button" onClick={() => handleCheckOnBol(book)}>
              Check on Bol.com
            </button>
            <button className="main-button" onClick={() => handleAddToLibrary(book)}>
              Add to Library
            </button>
            <button
              className="remove-button"
              onClick={() => handleRemoveFromWishlist(book)}
            >
              Remove from Wishlist
            </button>
          </div>
        )}

        {/* START READING BUTTON */}
        {!book.start_reading && !book.on_wishlist && (
          <button 
            className="main-button" 
            onClick={() => setShowStartReadingPopup(true)} // Opent modal
          >
            Start Reading
          </button>
        )}

        {/* STOP READING BUTTON */}
        {book.start_reading && !book.end_reading && (
          <button 
            className="main-button" 
            onClick={() => setShowStopReadingPopup(true)} // Opent modal
          >
            Stop Reading
          </button>
        )}

        {/* REMOVE FROM LIBRARY BUTTON */}
        {book.in_library && (
          <button 
            className="remove-button" 
            onClick={() => setShowRemoveConfirm(true)} // Opent modal
          >
            Remove from Library
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. RENDERING VAN DE MODALS (gebruikt de nieuwe subcomponenten)      */}
      {/* ------------------------------------------------------------------ */}
      
      {showStartReadingPopup && (
        <StartReadingModal
          book={book}
          onConfirm={confirmStartReading}
          onCancel={() => setShowStartReadingPopup(false)}
        />
      )}

      {showStopReadingPopup && (
        <StopReadingModal
          book={book}
          onConfirm={handleSubmitPopup}
          onCancel={() => setShowStopReadingPopup(false)}
        />
      )}

      {showRemoveConfirm && (
        <RemoveConfirmModal
          book={book}
          onConfirm={confirmRemoveFromLibrary}
          onCancel={() => setShowRemoveConfirm(false)}
        />
      )}
    </div>
  );
};

export default LibraryBookDetails;