import React, { useState } from 'react';
import { Button } from './ui/button';

const Getlocation = ({ onLocation, onSelectLocation }) => {
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = { lat: coords.latitude, lng: coords.longitude };
          setLocation(loc);
          setSelected(false);
          onLocation && onLocation(loc);
        },
        () => alert('Location access failed.')
      );
    } else {
      alert('Geolocation not supported.');
    }
  };

  const handleSelectLocation = () => {
    setSelected(true);
    if (onSelectLocation && location) onSelectLocation(location);
  };

  return (
    <div>
      <Button onClick={handleGetLocation}>Get My Location</Button>
    </div>
  );
};

export default Getlocation;
