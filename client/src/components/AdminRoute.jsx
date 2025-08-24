import React from 'react'
import { useContext } from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();


    if (loading) {
        return <div>Loading...</div>
    }
    if (user && user.role === 'admin') {
        return children;
    }

    if (user && user.role !== 'admin') {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AdminRoute
