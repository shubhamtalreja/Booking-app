import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<h1>Welcome to the Appointment Booking System</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;