// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/authService';

export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  return children;
}
