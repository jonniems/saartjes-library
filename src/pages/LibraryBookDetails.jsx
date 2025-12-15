import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBookDetails } from "../hooks/useBookDetails.js";
import StartReadingModal from "../components/StartReadingModal.jsx";
import StopReadingModal from "../components/StopReadingModal.jsx";
import RemoveConfirmModal from "../components/RemoveConfirmModal.jsx";
import EditBookModal from "../components/EditBookModal.jsx";
import { useVisitorMode } from "../context/useVisitorMode.js";

import BackIcon from "../assets/icons/back.svg?react";

const LibraryBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFriend } = useVisitorMode();

  // Get all data/functions from the hook
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
    handleSaveEdit, // <-- GEWIJZIGD: Naam aangepast naar handleSaveEdit
  } = useBookDetails(id, navigate);

  // Modal state
  const [showStopReadingPopup, setShowStopReadingPopup] = useState(false);
  const [showStartReadingPopup, setShowStartReadingPopup] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Save changes from edit modal
  const handleUpdateBook = async (updatedBook) => {
    // Gebruik de asynchrone handler van de hook en wacht op succes
    const success = await handleSaveEdit(updatedBook); // <-- GEWIJZIGD: Naam aangepast
    
    if (success) {
        setShowEditModal(false);
    }
    // Foutafhandeling wordt in de hook gedaan
  };

  // Add/remove overlay class on modal open
  useEffect(() => {
    const anyModalOpen =
      showStopReadingPopup ||
      showRemoveConfirm ||
      showStartReadingPopup ||
      showEditModal;

    document.body.classList.toggle("overlay-open", anyModalOpen);

    return () => {
      document.body.classList.remove("overlay-open");
    };
  }, [
    showStopReadingPopup,
    showRemoveConfirm,
    showStartReadingPopup,
    showEditModal,
  ]);

  const renderRating = (rating) => {
    const totalCircles = 5;
    const filledCircles = rating
      ? Math.min(Math.max(rating, 1), totalCircles)
      : 0;

    return Array.from({ length: totalCircles }, (_, i) => (
      <span
        key={i}
        className={i < filledCircles ? "filled-circle" : "unfilled-circle"}
      />
    ));
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error loading book details: {error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div>
      <div className="book-details-container">
        <div className="book-details-top-buttons">
          <div className="go-back">
            <Link onClick={handleGoBack}>
              <BackIcon alt="Back" style={{ width: "12px", height: "12px" }} />
              <span>go back</span>
            </Link>
          </div>
          {!isFriend && (
            <div className="edit">
              <Link onClick={() => setShowEditModal(true)}>edit</Link>
            </div>
          )}
        </div>

        <h1>{book.title}</h1>
        <h3>{book.author}</h3>
        <div className="book-details-genre">
          {book.is_fiction ? "Fiction" : "Non-Fiction"}
        </div>
        <hr />

        {book.in_library && (
          <div className="book-details-summary">
            <div className="book-details-dates">
              In library since: {book.in_library_from}
            </div>
            <div className="book-details-dates">
              Started reading on: {book.start_reading || "-"}
            </div>
            <div className="book-details-dates">
              Finished reading on: {book.end_reading || "-"}
            </div>
            <div className="book-details-rating">
              Rating: {renderRating(book.rating)}
            </div>
          </div>
        )}

        {book.on_wishlist && !isFriend && (
          <div className="wishlist-buttons">
            <button
              className="main-button"
              onClick={() => handleCheckOnBol(book)}
            >
              Check on Bol.com
            </button>
            <button
              className="main-button"
              onClick={() => handleAddToLibrary(book)}
            >
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

        {!isFriend && !book.start_reading && !book.on_wishlist && (
          <button
            className="main-button"
            onClick={() => setShowStartReadingPopup(true)}
          >
            Start Reading
          </button>
        )}

        {!isFriend && book.start_reading && !book.end_reading && (
          <button
            className="main-button"
            onClick={() => setShowStopReadingPopup(true)}
          >
            Stop Reading
          </button>
        )}

        {!isFriend && book.in_library && (
          <button
            className="remove-button"
            onClick={() => setShowRemoveConfirm(true)}
          >
            Remove from Library
          </button>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <EditBookModal
          book={book}
          onCancel={() => setShowEditModal(false)}
          onSave={handleUpdateBook}
        />
      )}

      {/* Other modals */}
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