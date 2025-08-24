import React, { useState, useEffect, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { getAvailabilityConfig, setAvailabilityConfig } from '../services/availability.service';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const AvailabilityManagement = () => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await getAvailabilityConfig();

        const filteredAvailability = DAYS_OF_WEEK.map((day) => {
          const dayConfig = data.weeklyAvailability.find(d => d.dayOfWeek === day);
          return dayConfig || { dayOfWeek: day, isAvailable: false, startTime: '09:00', endTime: '17:00' };
        })
        setAvailability({
          ...data,
          weeklyAvailability: filteredAvailability
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No availability schedule has been set up yet. Please configure and save one.');
          const defaultSchedule = {
            weeklyAvailability: DAYS_OF_WEEK.map(dayName => ({
              dayOfWeek: dayName, isAvailable: dayName !== 'Sunday' && dayName !== 'Saturday', // Default Mon-Fri to be available
              startTime: '09:00', endTime: '17:00'
            })),
            nonWorkingDays: []
          };
          setAvailability(defaultSchedule);
        } else {
          setError('Failed to load availability schedule.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleWeeklyChange = (index, field, value) => {

    setAvailability((prev) => {
      const newWeeklyAvailability = [...prev.weeklyAvailability];

      newWeeklyAvailability[index] = {
        ...newWeeklyAvailability[index],
        [field]: value
      };

      return { ...prev, weeklyAvailability: newWeeklyAvailability }

    })
  }


  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const savedData = await setAvailabilityConfig(availability);

      setAvailability(savedData);
      alert('Schedule saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedBlockedDates = useMemo(() => {
    if (!availability?.nonWorkingDays) return [];
    return availability.nonWorkingDays.map(dateStr => new Date(dateStr));
  }, [availability?.nonWorkingDays]);


  const handleBlockedDateSelect = (dates) => {
    const dateStrings = dates?.map(date => date.toISOString()) || [];

    setAvailability(prev => ({
      ...prev,
      nonWorkingDays: dateStrings,
    }));
  };

  if (loading) {
    return <p>Loading availability schedule...</p>;
  }

  return (
    <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Manage Weekly Hours</h3>
      <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
        <h3>Holidays & Blocked Dates</h3>
        <p>Select specific dates on the calendar to block them out. These will be treated as non-working days.</p>

        {availability?.nonWorkingDays && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <DayPicker
              // Set the mode to "multiple" to allow selecting many dates.
              mode="multiple"
              // The `min` and `max` props can be used to constrain the selectable dates.
              min={0} // 0 days from now, so today is the first selectable day.
              // The `selected` prop is bound to our memoized array of Date objects.
              selected={selectedBlockedDates}
              // The `onSelect` handler updates our main state.
              onSelect={handleBlockedDateSelect}
            />
            {/* Displaying the selected dates as a list for clarity */}
            <div>
              <h4>Currently Blocked Dates:</h4>
              {selectedBlockedDates.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedBlockedDates
                    .sort((a, b) => a - b) // Sort dates chronologically
                    .map(date => (
                      <li key={date.toISOString()} style={{ background: '#eee', padding: '5px 10px', borderRadius: '4px', marginBottom: '5px' }}>
                        {date.toLocaleDateString()}
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <p>No specific dates are blocked.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {availability?.weeklyAvailability && (
        <div>
          {availability.weeklyAvailability.map((day, index) => (
            <div key={day.dayOfWeek} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderBottom: '1px solid #eee' }}>
              <label style={{ flex: '0 0 120px', fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={day.isAvailable}
                  onChange={(e) => handleWeeklyChange(index, 'isAvailable', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                {day.dayOfWeek}
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => handleWeeklyChange(index, 'startTime', e.target.value)}
                  disabled={!day.isAvailable}
                  style={{ padding: '5px' }}
                />
                <span>to</span>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => handleWeeklyChange(index, 'endTime', e.target.value)}
                  disabled={!day.isAvailable}
                  style={{ padding: '5px' }}
                />
              </div>
            </div>
          ))}

          {/* <button onClick={handleSave} disabled={isSaving} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
            {isSaving ? 'Saving...' : 'Save Weekly Schedule'}
          </button> */}
        </div>
      )}
      <div style={{ padding: '20px', borderTop: '1px solid #ddd', textAlign: 'right', background: '#f9f9f9' }}>
        <button onClick={handleSave} disabled={isSaving} style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '1.1em', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          {isSaving ? 'Saving...' : 'Save All Availability Settings'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityManagement;