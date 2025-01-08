import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@deriv-com/quill-ui';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const Homepage = React.lazy(() => import('./pages/homepage'));
const DerivTrading = React.lazy(() => import('./pages/trading'));

const AuthHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token1');

    if (token) {
      handleAuthCallback(token).then((success) => {
        // Clear the token from URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        if (success) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      });
    }
  }, [location, handleAuthCallback, navigate]);

  return null;
};

const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthHandler />
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={<Homepage />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DerivTrading />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme='light' persistent>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
