import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, TextField, Text } from '@deriv-com/quill-ui';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import { authStore } from '../../stores/AuthStore';
import styles from './login.module.scss';

const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // Form validation
      if (!accountId.trim() || !password.trim()) {
        throw new Error('Please fill in all fields');
      }

      // Attempt login
      const success = await authStore.login({
        account_id: accountId.trim(),
        password: password.trim(),
      });

      if (success) {
        // Clear form
        setAccountId('');
        setPassword('');
        // Redirect to dashboard on success
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [authStore.isAuthenticated, navigate]);

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-box']}>
        <div className={styles['login-header']}>
          <BrandDerivLogoCoralIcon height={32} width={32} />
          <Text size="xl">Login to Trade</Text>
        </div>
        {error && (
          <div className={styles['error-message']}>
            <Text size="sm">{error}</Text>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <TextField
              id="accountId"
              name="accountId"
              value={accountId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountId(e.target.value)}
              placeholder="Enter your account ID"
              disabled={authStore.isAuthorizing}
              required
              autoComplete="username"
              inputMode="text"
            />
          </div>
          <div className={styles['form-group']}>
            <TextField
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={authStore.isAuthorizing}
              required
              autoComplete="current-password"
            />
          </div>
          <Button 
            type="submit"
            variant="primary"
            size="lg"
            disabled={authStore.isAuthorizing}
            fullWidth
          >
            {authStore.isAuthorizing ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  );
});

export default LoginPage;
