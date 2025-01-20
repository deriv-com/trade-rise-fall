import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { initializeDerivAPI } from "../services/deriv-api.instance";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import App from "../App";
import { authStore } from "../stores/AuthStore";
import { balanceEndpoints } from "../api/endpoints";

const AppInitializer = observer(() => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (authStore.isAuthenticated) {
      balanceEndpoints.fetchBalance().catch(console.error);
    }
  }, [authStore.isAuthenticated]);

  useEffect(() => {
    const initialize = async () => {
      const app_id = process.env.REACT_APP_WS_PORT;
      const endpoint = process.env.REACT_APP_WS_URL;

      if (!app_id || !endpoint) {
        console.error("Required environment variables are not set");
        return;
      }

      initializeDerivAPI({ app_id, endpoint });
      setIsInitialized(true);
    };

    initialize().catch(console.error);
  }, []);

  return isInitialized ? <App /> : <LoadingSpinner />;
});

export default AppInitializer;
