import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid green', // Changed border color to green
    padding: '20px',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  button: {
    background: 'green', // Changed button background color to green
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px', // Added margin for separation
  },
};

const AcceptAppointmentPopup = ({ isOpen, onRequestClose, appointmentId, onAccept }) => {
  const handleAccept = () => {
    onAccept(appointmentId);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="modal-body text-center">
     
        <h3>Are you sure you want to accept this Appointment?</h3>
        <div className="m-t-20">
          <button style={customStyles.button} onClick={onRequestClose}>
            Close
          </button>
          <button style={customStyles.button} onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

AcceptAppointmentPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  appointmentId: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default AcceptAppointmentPopup;
