import React from 'react';
import { format, isPast } from 'date-fns';
import './AppointmentCard.css';

const AppointmentCard = ({ appointment, onCancel }) => {
    if (!appointment || !appointment.service) {
        return null;
    }

    const isAppointmentPast = isPast(new Date(appointment.startTime));

    return (
        <div className={`appointment-card ${isAppointmentPast ? 'past-appointment' : ''}`}>
            <div className="card-header">
                <h4>{appointment.service.name}</h4>
            </div>
            <div className="card-body">
                <p>
                    <strong>Date:</strong>
                    {format(new Date(appointment.startTime), 'EEEE, MMMM do, yyyy')}
                </p>
                <p>
                    <strong>Time:</strong>
                    {`${format(new Date(appointment.startTime), 'p')} - ${format(new Date(appointment.endTime), 'p')}`}
                </p>
                <p>
                    <strong>Price:</strong>
                    ${appointment.service.price}
                </p>
            </div>
            {!isAppointmentPast && (
                <div className="card-footer">
                    <button
                        className="btn-cancel"
                        onClick={() => onCancel(appointment._id)}
                    >
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;