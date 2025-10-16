import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboardPage from './pages/ClientDashboardPage';
import AdminRoute from './components/AdminRoute';
import VendorRegisterPage from './pages/VendorRegisterPage';


function App() {
  return (
    <div>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/vendor/register' element={<VendorRegisterPage />} />
          <Route path='/booking' element={<BookingPage />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <ClientDashboardPage />
            </ProtectedRoute>} />
          <Route path='/admin/dashboard' element={<AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>} />
          <Route path='*' element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;