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
    border: "2px solid skyblue", // Updated border color
  
  },
  button: {
    background: "skyblue", // Updated button background color
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

Modal.setAppElement("#root");

function Popup({ isOpen, onRequestClose, message }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Success Popup"
    >
      <p>{message}</p>
      <button style={customStyles.button} onClick={onRequestClose}>
        Close
      </button>
    </Modal>
  );
}

// Add PropTypes validation
Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default Popup;


