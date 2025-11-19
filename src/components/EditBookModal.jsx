import { useState } from "react";
import CloseIcon from "../assets/icons/close.svg?react";
import PropTypes from "prop-types";

const EditBookModal = ({ book, onCancel, onSave }) => {
  const [form, setForm] = useState({
    author: book.author || "",
    title: book.title || "",
    is_fiction: book.is_fiction || false,
    in_library_from: book.in_library_from || "",
    in_library: book.in_library || false,
    is_gift: book.is_gift || false,
    start_reading: book.start_reading || "",
    end_reading: book.end_reading || "",
    rating: book.rating || 0,
    reading_complete: book.reading_complete || false,
    preservation_book: book.preservation_book || false,
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const renderRateCircles = (currentRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i + 1}
        onClick={() => setField("rating", i + 1)}
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

        <h2>Edit Book Details</h2>
        <div className="modal-content">
          <div className="add-book">
            <input
              type="text"
              id="title"
              className="add-book-input"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
            />
            <input
              type="text"
              id="author"
              className="add-book-input"
              value={form.author}
              onChange={(e) => setField("author", e.target.value)}
              required
            />

            <div className="add-book-options">
              <label>
                <input
                  type="radio"
                  name="bookType"
                  value="fiction"
                  checked={form.is_fiction === true}
                  onChange={() => setField("is_fiction", true)}
                />
                <span></span>
                Fiction
              </label>

              <label>
                <input
                  type="radio"
                  name="bookType"
                  value="non-fiction"
                  checked={form.is_fiction === false}
                  onChange={() => setField("is_fiction", false)}
                />
                <span></span>
                Non-Fiction
              </label>
            </div>
            <div className="add-book-dates">
              <div className="add-book-date">
                <label>In library since</label>
                <input
                  type="date"
                  value={form.in_library_from || ""}
                  onChange={(e) => setField("in_library_from", e.target.value)}
                />
              </div>
              <div className="add-book-date">
                <label>Started reading on</label>
                <input
                  type="date"
                  value={form.start_reading || ""}
                  onChange={(e) => setField("start_reading", e.target.value)}
                />
              </div>
              <div className="add-book-date">
                <label>Finished reading on</label>
                <input
                  type="date"
                  value={form.end_reading || ""}
                  onChange={(e) => setField("end_reading", e.target.value)}
                />
              </div>
              <div className="add-book-options">
                <label>
                  <input
                    type="checkbox"
                    checked={form.in_library}
                    onChange={(e) => setField("in_library", e.target.checked)}
                  />
                  <span></span>
                  In library
                </label>
              </div>
            </div>

            <div className="add-book-options">
              <label>
                <input
                  type="checkbox"
                  checked={form.is_gift}
                  onChange={(e) => setField("is_gift", e.target.checked)}
                />
                <span></span>
                Gift
              </label>
            </div>
            <div className="add-book-options">
              <label>
                <input
                  type="checkbox"
                  checked={form.reading_complete}
                  onChange={(e) =>
                    setField("reading_complete", e.target.checked)
                  }
                />
                <span></span>
                Reading complete
              </label>
            </div>
            <div className="add-book-options">
              <label>
                <input
                  type="checkbox"
                  checked={form.preservation_book}
                  onChange={() =>
                    setField("preservation_book", !form.preservation_book)
                  }
                />
                <span></span>
                Preservation book
              </label>
            </div>
          </div>

          <div className="add-book-date">
            <label>Change rating</label>
            <div className="rate-row">{renderRateCircles(form.rating)}</div>
          </div>
        </div>

        <div className="modal-buttons">
          <button
            className="reading-status-save"
            onClick={() => onSave(form)}
          >
            Save
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Add PropTypes here ---
EditBookModal.propTypes = {
  book: PropTypes.shape({
    author: PropTypes.string,
    title: PropTypes.string,
    is_fiction: PropTypes.bool,
    in_library_from: PropTypes.string,
    in_library: PropTypes.bool,
    is_gift: PropTypes.bool,
    start_reading: PropTypes.string,
    end_reading: PropTypes.string,
    rating: PropTypes.number,
    reading_complete: PropTypes.bool,
    preservation_book: PropTypes.bool,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditBookModal;
