import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeDerivAPI } from "./services/deriv-api.instance";
import { authService } from "./services/auth.service";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<LoadingSpinner />);

  const initializeApp = async (): Promise<void> => {
    const app_id = process.env.REACT_APP_WS_PORT;
    const endpoint = process.env.REACT_APP_WS_URL;

    if (!app_id || !endpoint) {
      console.error("Required environment variables are not set");
      return;
    }

    initializeDerivAPI({
      app_id,
      endpoint,
    });

    // Initialize auth service with existing token if available
    await authService.initialize();

    // Remove the initial loader if it exists
    const initialLoader = document.getElementById("initial-loader");
    if (initialLoader) {
      initialLoader.remove();
    }

    // Render the actual app (which has its own ThemeProvider and loading states)
    root.render(<App />);
  };

  initializeApp().catch(console.error);
}
