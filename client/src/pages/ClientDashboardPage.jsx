import React from 'react';
import { useEffect, useState } from 'react';
import { cancelAppointment, getAppointments } from '../services/appointment.service';
import { format, isFuture } from 'date-fns';
import { useMemo } from 'react';
import AppointmentCard from '../components/AppointmentCard';

const ClientDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchAppointments = async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const upcoming = appointments.filter(
      appt => isFuture(new Date(appt.startTime))
    );
    const past = appointments.filter(
      appt => !isFuture(new Date(appt.startTime))
    );
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await cancelAppointment(appointmentId);

      setAppointments(prevAppointments =>
        prevAppointments.filter(appt => appt._id !== appointmentId)
      );

      alert('Appointment cancelled successfully!');

    } catch (err) {
      console.error(err);
      alert(err.message || 'There was a problem cancelling the appointment.');
    }
  };



  if (loading) {
    return <div style={{ padding: '20px' }}>Loading your appointments...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        My Appointments
      </h2>

      <section>
        <h3 style={{ color: '#007bff' }}>Upcoming</h3>
        {upcomingAppointments.length === 0 ? (
          <p>You have no upcoming appointments.</p>
        ) : (
          <div>
            {upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h3 style={{ color: '#6c757d' }}>Past</h3>
        {pastAppointments.length === 0 ? (
          <p>You have no past appointments recorded.</p>
        ) : (
          <div>
            {pastAppointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientDashboardPage;