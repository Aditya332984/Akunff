import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading, logout } = useAuth();

  // Wait until loading is complete to avoid redirect flicker
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  // Check if token is expired
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        logout();
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error('Token decoding error:', error);
      logout();
      return <Navigate to="/login" replace />;
    }
  }

  // If user's role doesn't match the required role, redirect to appropriate page
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/products'} replace />;
  }

  // If user is logged in and has the correct role, render the protected component
  return children;
};

export default ProtectedRoute;