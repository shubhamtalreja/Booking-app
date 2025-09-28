import React from 'react'

const ServiceDetailModal = ({isOpen, onClose, selection}) => {
if (!isOpen || !selection?.service) {
    return null;
  }

  // Format the date and time for a more user-friendly display.
  // const formattedDate = format(selection.date, 'EEEE, MMMM do, yyyy');
  // const formattedTime = selection.time;

  return (
    // The main overlay. We conditionally add the 'open' class for the CSS transition.
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* 
        We stop propagation on the content click. This prevents the modal from closing
        if the user clicks inside the content area (as the overlay's onClick would otherwise trigger).
      */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Your Booking</h3>
        </div>
        <div className="modal-body">
          <p>
            You are about to book the following appointment:
          </p>
          <p>
            <strong>Service:</strong> {selection.service.name}
          </p>
          {/* <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Time:</strong> {formattedTime}
          </p> */}
          <p>
            <strong>Price:</strong> &#8377;{selection.service.price}
          </p>
        </div>
        <div className="modal-footer">
          {/* The "Cancel" button calls the onClose handler passed in props. */}
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
          {/* The "Confirm" button calls the onConfirm handler. */}
          <button className="btn-confirm" onClick={onConfirm}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal
