import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@deriv-com/quill-ui";
import { observer } from "mobx-react-lite";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import Header from "./components/Header/Header";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Lazy load components for better performance
const Homepage = React.lazy(() => import("./pages/homepage"));
const DerivTrading = React.lazy(() => import("./pages/trading"));
const NotFoundPage = React.lazy(() => import("./pages/404"));
const LoginPage = React.lazy(() => import("./pages/login"));

// Separate component for the loading fallback
const LoadingFallback = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <LoadingSpinner />
  </div>
);

const AppContent = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<DerivTrading />} />
        
        {/* Handle 404 and invalid routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = observer(() => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme="light" persistent>
        <BrowserRouter basename="/trade-rise-fall">
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
});

export default App;
