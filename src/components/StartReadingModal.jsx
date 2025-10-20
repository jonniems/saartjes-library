import { useState } from "react";
import PropTypes from "prop-types"; // <-- Importeer PropTypes
import CloseIcon from "../assets/icons/close.svg?react";

/**
 * @param {object} book
 * @param {function} onConfirm
 * @param {function} onCancel
 */

const StartReadingModal = ({ book, onConfirm, onCancel }) => {
  const [startDateOption, setStartDateOption] = useState("today");
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const handleConfirm = async () => {
    const startDate =
      startDateOption === "today"
        ? new Date().toISOString()
        : new Date(selectedStartDate).toISOString();

    const success = await onConfirm(startDate);
    if (success) {
      onCancel();
    }
  };

  const isConfirmDisabled = startDateOption === "choose" && !selectedStartDate;

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
        <div className="stop-reading-popup-details">
          <h1>{book.title}</h1>
          <h3>{book.author}</h3>
          <hr />
          <div className="start-reading-question">
            <label>
              <h3>
                <i>When did you start reading {book.title}?</i>
              </h3>
            </label>

            <div className="add-book-options">
              <label>
                <input
                  type="radio"
                  name="startDateOption"
                  value="today"
                  checked={startDateOption === "today"}
                  onChange={() => setStartDateOption("today")}
                />
                <span></span>
                Today
              </label>

              <label>
                <input
                  type="radio"
                  name="startDateOption"
                  value="choose"
                  checked={startDateOption === "choose"}
                  onChange={() => setStartDateOption("choose")}
                />
                <span></span>
                Choose a date
              </label>
            </div>

            {startDateOption === "choose" && (
              <div className="add-book-date">
                <input
                  type="date"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                  max={new Date().toISOString().substring(0, 10)}
                />
              </div>
            )}
          </div>

          <div className="confirmation-buttons">
            <button
              type="button"
              className="confirm-button"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
            >
              Start reading
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Not reading it now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

StartReadingModal.propTypes = {
  book: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default StartReadingModal;
