// server/tests/availability.test.js

// Let's assume you have a utility function like this somewhere in your project:
// server/utils/availabilityCalculator.js
const calculateAvailableSlots = (workingHours, serviceDuration, existingAppointments) => {
  const slots = [];
  const { startTime, endTime } = workingHours; // e.g., '09:00', '17:00'
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);

  // Create a set of all booked minutes for quick lookup
  const bookedMinutes = new Set();
  existingAppointments.forEach(appt => {
    const apptStart = new Date(appt.startTime).getHours() * 60 + new Date(appt.startTime).getMinutes();
    const apptEnd = new Date(appt.endTime).getHours() * 60 + new Date(appt.endTime).getMinutes();
    for (let i = apptStart; i < apptEnd; i++) {
      bookedMinutes.add(i);
    }
  });

  // Iterate through the day by the service duration
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += serviceDuration) {
      const slotStartMinutes = hour * 60 + minute;
      const slotEndMinutes = slotStartMinutes + serviceDuration;
      
      let isAvailable = true;
      for (let i = slotStartMinutes; i < slotEndMinutes; i++) {
        if (bookedMinutes.has(i)) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable && slotEndMinutes <= endHour * 60) {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        slots.push(`${h}:${m}`);
      }
    }
  }
  return slots;
}

// Now, let's test it
describe('Availability Calculation Logic', () => {

  const workingHours = { startTime: '09:00', endTime: '12:00' }; // Shortened for test brevity
  const serviceDuration = 60; // 60 minutes

  it('should return all slots when there are no existing appointments', () => {
    const existingAppointments = [];
    const slots = calculateAvailableSlots(workingHours, serviceDuration, existingAppointments);
    // Expected slots are 9:00, 10:00, 11:00. 12:00 is the end time.
    expect(slots).toEqual(['09:00', '10:00', '11:00']);
  });

  it('should correctly skip a slot taken by an existing appointment', () => {
    const today = new Date().toISOString().split('T')[0];
    const existingAppointments = [
      {
        startTime: new Date(`${today}T10:00:00.000Z`),
        endTime: new Date(`${today}T11:00:00.000Z`)
      }
    ];
    const slots = calculateAvailableSlots(workingHours, serviceDuration, existingAppointments);
    // The '10:00' slot should be missing
    expect(slots).toEqual(['09:00', '11:00']);
  });
  
  it('should handle appointments that are shorter than the service duration', () => {
    const today = new Date().toISOString().split('T')[0];
    const existingAppointments = [
        { // A 30 minute appointment from 9:30 to 10:00
          startTime: new Date(`${today}T09:30:00.000Z`),
          endTime: new Date(`${today}T10:00:00.000Z`)
        }
    ];
    // We are looking for 60 minute slots
    const slots = calculateAvailableSlots(workingHours, serviceDuration, existingAppointments);
    // The 9:00 slot is blocked because the 9:30 appt falls within it.
    // The 10:00 slot is available.
    expect(slots).toEqual(['10:00', '11:00']);
  });
});