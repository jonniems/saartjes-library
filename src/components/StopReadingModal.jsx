import { useState } from "react";
import PropTypes from "prop-types";
import CloseIcon from "../assets/icons/close.svg?react";

/**
 * * @param {object} book
 * @param {function} onConfirm
 * @param {function} onCancel
 */

const StopReadingModal = ({ book, onConfirm, onCancel }) => {
  const [rating, setRating] = useState(book.rating || 1);
  const [readingComplete, setReadingComplete] = useState(true);
  const [preservationBook, setPreservationBook] = useState(
    book.preservation_book || false
  );

  const handleSubmit = async () => {
    const success = await onConfirm(rating, readingComplete, preservationBook);
    if (success) {
      onCancel();
    }
  };

  const renderRateCircles = (currentRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i + 1}
        onClick={() => setRating(i + 1)}
        className={
          currentRating >= i + 1 ? "filled-circle-rate" : "unfilled-circle-rate"
        }
      />
    ));
  };

  return (
    <div className="stop-reading-popup">
      <div className="stop-reading-popup-content">
        <CloseIcon
          alt="Close"
          className="stop-reading-popup-close-icon"
          width="24px"
          height="24px"
          onClick={onCancel}
        />
        <div className="modal-content">
          <div className="stop-reading-popup-details">
            <h1>{book.title}</h1>
            <h3>{book.author}</h3>
            <div className="book-details-genre">
              {book.is_fiction ? "Fiction" : "Non-Fiction"}
            </div>
            <hr />
            <div className="reading-status">
              <label>Did you finish {book.title}?</label>
              <div className="reading-status-buttons">
                <button
                  type="button"
                  className={
                    readingComplete === true
                      ? "status-button green active"
                      : "status-button green"
                  }
                  onClick={() => setReadingComplete(true)}
                >
                  I finished the book
                </button>
                <button
                  type="button"
                  className={
                    readingComplete === false
                      ? "status-button red active"
                      : "status-button red"
                  }
                  onClick={() => setReadingComplete(false)}
                >
                  I stopped reading
                </button>
              </div>
            </div>
            <div className="reading-status">
              <label>How do you rate {book.title}?</label>
              <div className="reading-status-rate">
                {renderRateCircles(rating)}
              </div>
            </div>
            <div className="reading-status-preservation">
              <label>
                <input
                  type="checkbox"
                  checked={preservationBook}
                  onChange={() => setPreservationBook(!preservationBook)}
                />
                <span></span>
                Preservation book
              </label>
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="reading-status-save">
            Stop reading
          </button>
        </div>
      </div>
    </div>
  );
};

StopReadingModal.propTypes = {
  book: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default StopReadingModal;
