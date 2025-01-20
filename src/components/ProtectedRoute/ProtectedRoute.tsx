import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores/AuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = observer(function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = authStore;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
