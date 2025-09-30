import React from 'react'

const ServiceDetailModal = ({ isOpen, onClose, selection }) => {
  if (!isOpen || !selection) {
    return null;
  }
  return (
    // The main overlay. We conditionally add the 'open' class for the CSS transition.
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* 
        We stop propagation on the content click. This prevents the modal from closing
        if the user clicks inside the content area (as the overlay's onClick would otherwise trigger).
      */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Service Details</h3>
        </div>
        <div className="modal-body">
         
          <div>
            {selection.imageUrls.map((image, index) => {
              console.log(image);
              return (
                <img key={index} src={image} alt={`service-${index}`} className="object-cover w-full h-100 rounded" />
              );
            })}
            <p>
              <strong>Description:</strong> {selection.description}
            </p>
          </div>
          <p>
            <strong>Service:</strong> {selection.name}
          </p>
          <p>
            <strong>Price:</strong> &#8377;{selection.price}
          </p>
          <p>
            <strong>Rating:</strong> ****
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal
