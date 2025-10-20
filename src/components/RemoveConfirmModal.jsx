import PropTypes from "prop-types";
import CloseIcon from "../assets/icons/close.svg?react";

/**
 * @param {object} book
 * @param {function} onConfirm
 * @param {function} onCancel
 */

const RemoveConfirmModal = ({ book, onConfirm, onCancel }) => {
  return (
    <div className="stop-reading-popup">
      <div className="stop-reading-popup-content">
        <CloseIcon
          alt="Close"
          className="stop-reading-popup-close-icon"
          onClick={onCancel}
          width="24px"
          height="24px"
        />
        <div className="stop-reading-popup-details">
          <h3>
            <i>
              Are you sure you want to remove {book.title} from your library?
            </i>
          </h3>
          <div className="confirmation-buttons">
            <button
              type="button"
              className="confirm-button"
              onClick={onConfirm}
            >
              Yes, I&apos;m sure
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              No, I&apos;ll keep it for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RemoveConfirmModal.propTypes = {
  book: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RemoveConfirmModal;
