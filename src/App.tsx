import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@deriv-com/quill-ui';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Header from './components/Header/Header';
import { AuthProvider } from './contexts/AuthContext';

const Homepage = React.lazy(() => import('./pages/homepage'));
const DerivTrading = React.lazy(() => import('./pages/trading'));
const AuthCallback = React.lazy(() => import('./pages/auth/callback'));

const App: React.FC = () => {
  return (
    <ThemeProvider theme='light' persistent>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Header />
            <Routes>
              <Route 
                path="/" 
                element={<Homepage />} 
              />
              <Route 
                path="/dashboard" 
                element={<DerivTrading />} 
              />
              <Route 
                path="/auth/callback" 
                element={<AuthCallback />} 
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
