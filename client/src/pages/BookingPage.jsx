import React from 'react';
import ServiceList from '../components/ServiceList';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAvailability, getAvailabilityConfig } from '../services/availability.service';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useCallback } from 'react';
import { isBefore, startOfDay } from 'date-fns';
import ConfirmationModal from '../components/ConfirmationModal';
import { createAppointment } from '../services/appointment.service';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingPage = () => {

  const [selection, setSelection] = useState({
    service: null,
    date: null,
    time: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(null);

  const [availableConfig, setAvailableConfig] = useState([]);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [configError, setConfigError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const fetchAvailabilityConfig = async () => {
      setIsConfigLoading(true);
      setConfigError(null);
      try {
        const config = await getAvailabilityConfig();
        setAvailableConfig(config);
      } catch (error) {
        setConfigError(error.message);
      } finally {
        setIsConfigLoading(false);
      }
    }
    fetchAvailabilityConfig();
  }, []);

  useEffect(() => {
    if (!selection.date || !selection.service) {
      return;
    }
    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      setSlotError(null);
      try {
        const slots = await getAvailability(selection.service._id, selection.date);
        setAvailableSlots(slots);
      } catch (error) {
        setSlotError(error.message);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchAvailableSlots();
  }, [selection.service, selection.date]);

  const isDayDisabled = useCallback((day) => {
    if (!availableConfig) return false;

    // 1. Disable dates in the past.
    if (isBefore(day, startOfDay(new Date()))) {
      return true;
    }

    const dayOfWeekIndex = day.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekName = days[dayOfWeekIndex];

    // 2. Disable days based on the weekly schedule.
    const daySchedule = availableConfig.weeklyAvailability.find(
      (d) => d.dayOfWeek === dayOfWeekName
    );
    if (!daySchedule || !daySchedule.isAvailable) {
      return true;
    }

    const isHoliday = availableConfig.nonWorkingDays.some(
      (holiday) => startOfDay(new Date(holiday)).getTime() === startOfDay(day).getTime()
    );
    if (isHoliday) {
      return true;
    }

    return false;

  }, [availableConfig]);

  const handleDateSelect = (date) => {
    if (date) {
      setSelection(prev => ({
        ...prev,
        date: date,
        time: null
      }));
      setAvailableSlots([]);
    }
  }


  const handleServiceSelect = (service) => {
    setSelection({
      service: service,
      date: null,
      time: null
    })
    setAvailableSlots([]);
  }

  const handleTimeSelect = (time) => {
    setSelection(prev => ({
      ...prev,
      time: time
    }));
  }

  const handleBookingConfirm = async () => {
    if (!user) {
      return navigate("/login", { state: { from: location }, replace: true });
    }
      try {

        const response = await createAppointment(selection);
        alert('Appointment booked successfully!');
      }catch (error) {
        console.error('Booking failed:', error);
        alert('There was a problem booking your appointment. Please try again.');
        return;
      }

    setIsModalOpen(false);
  };

  if (isConfigLoading) return <LoadingSpinner/>;
  if (configError) return <p style={{ color: 'red' }}>{configError}</p>;
  return (
    <div>
      <ServiceList
        onServiceSelect={handleServiceSelect}
        selectedService={selection.service} />


      {selection.service && (
        <div style={{ marginTop: '20px' }}>
          <h3>Select a Date for {selection.service.name}</h3>
          <DayPicker
            mode="single"
            selected={selection.date}
            onSelect={handleDateSelect}
            disabled={isDayDisabled}
            footer={selection.date ? `You selected ${selection.date.toLocaleDateString()}.` : 'Please select a day.'}
          />
        </div>
      )}
      {selection.date && (
        <div style={{ marginTop: '20px' }}>
          <h3>Step 3: Select a Time</h3>
          {loadingSlots && <p>Loading available times...</p>}
          {slotError && <p style={{ color: 'red' }}>{slotError}</p>}

          {!loadingSlots && !slotError && (
            <div>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => {
                  // Determine if this is the currently selected button.
                  const isSelected = selection.time === slot;

                  return (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      style={{
                        margin: '5px',
                        padding: '10px 15px',
                        fontSize: '1em',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#007bff' : '#f8f9fa',
                        color: isSelected ? 'white' : 'black',
                        border: isSelected ? '1px solid #0056b3' : '1px solid #ccc',
                        borderRadius: '5px',
                        transition: 'background-color 0.2s, color 0.2s',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })
              ) : (
                <p>No available slots for this day. Please select another date.</p>
              )}
            </div>
          )}
        </div>)}

      {selection.service && selection.date && selection.time && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            style={{
              padding: '12px 25px',
              fontSize: '1.2em',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            // Clicking this button opens the confirmation modal.
            onClick={() => setIsModalOpen(true)}
          >
            Book Now
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBookingConfirm}
        selection={selection}
      />

    </div>
  );
};

export default BookingPage;