import React from 'react';
import { Button, Heading } from '@deriv-com/quill-ui';
import { authStore } from '../../stores/AuthStore';
import './homepage.scss';

const Homepage: React.FC = () => {

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
          onClick={() => authStore.login()}
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
