import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores/AuthStore";
import { isLogged } from "../../common/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = observer(function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = authStore;

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (!isLogged()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
