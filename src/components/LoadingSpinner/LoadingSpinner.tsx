import React from 'react';
import { Spinner } from '@deriv-com/quill-ui';

const LoadingSpinner: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <Spinner size="lg" />
  </div>
);

export default LoadingSpinner;
