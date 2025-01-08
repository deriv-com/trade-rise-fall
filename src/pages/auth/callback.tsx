import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const success = await authService.handleOAuthCallback(urlParams);

        if (success) {
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#ff444f', marginBottom: '20px' }}>{error}</p>
        <p>Redirecting to homepage...</p>
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default AuthCallback;
