import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  // Wait until loading is complete to avoid redirect flicker
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  // If user's role doesn't match the required role, redirect to appropriate page
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/products'} replace />;
  }

  // If user is logged in and has the correct role, render the protected component
  return children;
};

export default ProtectedRoute;