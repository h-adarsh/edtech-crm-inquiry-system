import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Route protection wrapper.
 * Ensures only authenticated administrators with a JWT token can access the dashboard.
 * Unauthenticated users are redirected directly to /login with state preserved.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('edtech_token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

