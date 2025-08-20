import React from 'react';
import ServiceList from '../components/ServiceList';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAvailability } from '../services/availability.service';
import { DayPicker } from 'react-day-picker';

const BookingPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(null);


  useEffect(() => {
    if (!selectedDate || !selectedService) {
      return;
    }
    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      setSlotError(null);
      try {
        const slots = await getAvailability(selectedService._id, selectedDate);
        setAvailableSlots(slots);
      } catch (error) {
        setSlotError(error.message);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchAvailableSlots();
  },[ selectedService, selectedDate])
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setAvailableSlots([]);
    console.log('Selected service:', service);
  }
  return (
    <div>
      <h2>Book Your Appointment</h2>
      <p>Here clients will be able to select a service and book a time slot.</p>
      <ServiceList
        onServiceSelect={handleServiceSelect}
        selectedService={selectedService} />


      {selectedService && (
        <div style={{ marginTop: '20px' }}>
          <h3>Select a Date for {selectedService.name}</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
      )}
      {selectedDate && (
        <div style={{ marginTop: '20px' }}>
          <h3>Step 3: Select a Time</h3>
          {loadingSlots && <p>Loading available times...</p>}
          {slotError && <p style={{ color: 'red' }}>{slotError}</p>}

          {!loadingSlots && !slotError && (
            <div>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <button key={slot} style={{ margin: '5px' }}>
                    {slot}
                  </button>
                ))
              ) : (
                <p>No available slots for this day. Please select another date.</p>
              )}
            </div>
          )}
        </div> )}

    </div>
  );
};

export default BookingPage;