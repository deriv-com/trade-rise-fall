import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@deriv-com/quill-ui";
import { observer } from "mobx-react-lite";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import Header from "./components/Header/Header";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const Homepage = React.lazy(() => import("./pages/homepage"));
const DerivTrading = React.lazy(() => import("./pages/trading"));
const NotFoundPage = React.lazy(() => import("./pages/404"));
const LoginPage = React.lazy(() => import("./pages/login"));

const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Homepage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<DerivTrading />} />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
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
