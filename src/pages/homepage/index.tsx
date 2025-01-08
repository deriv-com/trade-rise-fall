import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Heading } from '@deriv-com/quill-ui';
import './homepage.scss';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = (): void => {
    navigate('/login');
  };

  return (
    <div className="homepage">
      <div className="homepage__content">
        <Heading.H1 className="homepage__title">
          Deriv: Option Trading
        </Heading.H1>
        
        <Heading.H3 className="homepage__subtitle">
          Mirror the success of top traders automatically. Set up in minutes
        </Heading.H3>
        
        <Button
          onClick={handleGetStarted}
          variant="primary"
          size="lg"
        >
          Get started
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
