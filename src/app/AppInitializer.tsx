import React, { useState, useEffect } from "react";
import { initializeDerivAPI } from "../services/deriv-api.instance";
import { authService } from "../services/auth.service";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import App from "../App";

const AppInitializer: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const app_id = process.env.REACT_APP_WS_PORT;
      const endpoint = process.env.REACT_APP_WS_URL;

      if (!app_id || !endpoint) {
        console.error("Required environment variables are not set");
        return;
      }

      initializeDerivAPI({ app_id, endpoint });
      await authService.initialize();
      setIsInitialized(true);
    };

    initialize().catch(console.error);
  }, []);

  return isInitialized ? <App /> : <LoadingSpinner />;
};

export default AppInitializer;
