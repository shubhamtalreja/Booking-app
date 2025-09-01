import { Button } from '@/components/ui/button';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Welcome to our Appointment Booking App! Easily schedule your appointments
        online with just a few clicks. Choose your preferred service, select a convenient
        date and time, and confirm your booking instantly. Start planning ahead and enjoy a
        hassle-free appointment experience—book your appointment today!</h4>
      <Button className="mt-4" variant="default" size="lg" asChild>
        <Link to="/booking" className="nav-links">
          Book Now
        </Link>
      </Button>
    </div>
  );
};


export default HomePage;