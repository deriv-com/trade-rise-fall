import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initializeDerivAPI } from "./services/deriv-api.instance.ts";
import { authService } from "./services/auth.service.ts";

const initializeApp = async () => {
  // Initialize Deriv API once before render
  const app_id = process.env.REACT_APP_WS_PORT;
  const endpoint = process.env.REACT_APP_WS_URL;

  if (!app_id || !endpoint) {
    console.error('Required environment variables are not set');
    return;
  }

  initializeDerivAPI({
    app_id,
    endpoint,
  });

  // Initialize auth service with existing token if available
  await authService.initialize();

  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
};

initializeApp().catch(console.error);
