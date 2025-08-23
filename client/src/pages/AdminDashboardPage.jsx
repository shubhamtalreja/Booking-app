import React from 'react';
import { useEffect, useState,  useMemo} from 'react';
import { getAllAppointments } from '../services/appointment.service';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import AvailabilityManagement from '../components/AvailabilityManagement';
import ServiceManagement from '../components/ServiceManagement';

const AdminDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllAppointments();

        const sortedData = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setAppointments(sortedData);
      } catch (err) {
        setError(err.message || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllAppointments();
  }, []);


  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    const now = new Date();

    switch (filter) {
      case 'day':
        return appointments.filter(appt => isToday(new Date(appt.startTime)));
      case 'week':
        return appointments.filter(appt => isThisWeek(new Date(appt.startTime)));
      case 'month':
        return appointments.filter(appt => isThisMonth(new Date(appt.startTime)));
      case 'all':
      default:
        return appointments;
    }
  }, [appointments, filter]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading all appointments...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        Admin Dashboard
      </h2>

      <section>        <h3>All Appointments</h3>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          {['all', 'day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                border: '1px solid #007bff',
                borderRadius: '5px',
                textTransform: 'capitalize',
                backgroundColor: filter === period ? '#007bff' : 'white',
                color: filter === period ? 'white' : '#007bff',
                fontWeight: filter === period ? 'bold' : 'normal',
              }}
            >
              {period === 'all' ? 'All Time' : `This ${period}`}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <p>No appointments match the current filter.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '12px' }}>Client</th>
                <th style={{ padding: '12px' }}>Service</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Time</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt, index) => (
                <tr key={appt._id} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '12px' }}>{appt.client.name}</td>
                  <td style={{ padding: '12px' }}>{appt.service.name}</td>
                  <td style={{ padding: '12px' }}>{format(new Date(appt.startTime), 'MMMM d, yyyy')}</td>
                  <td style={{ padding: '12px' }}>{format(new Date(appt.startTime), 'p')}</td>
                  <td style={{ padding: '12px' }}>{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section>
        <ServiceManagement />
      </section>
      <section>
        <AvailabilityManagement />
      </section>
    </div>
  );
};

export default AdminDashboardPage;