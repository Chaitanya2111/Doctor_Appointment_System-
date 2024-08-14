
import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid red", // Changed border color to red
  },
  button: {
    background: "red", // Changed button background color to red
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px", // Added margin for separation
  },
};

Modal.setAppElement("#root");

function DeletePopup({ isOpen, onRequestClose, message, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Delete Confirmation Popup"
    >
      <p>{message}</p>
      <button style={customStyles.button} onClick={onConfirm}> {/* Call onConfirm function */}
        OK
      </button>
      <button style={customStyles.button} onClick={onRequestClose}>
        Cancel
      </button>
    </Modal>
  );
}

// Add PropTypes validation
DeletePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired, // Add new prop type for onConfirm function
};

export default DeletePopup;
