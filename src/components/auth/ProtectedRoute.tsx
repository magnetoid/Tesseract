import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

interface RouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Onboarding Guard
  if (user && !user.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
