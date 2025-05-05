import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  userType?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If userType is specified, check if the user has the correct role
  if (userType && user?.role !== userType) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;