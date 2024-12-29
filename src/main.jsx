import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initializeDerivAPI } from "./services/deriv-api.instance.ts";

// Initialize Deriv API once before render
initializeDerivAPI({
  app_id: process.env.REACT_APP_WS_PORT, // Default Deriv app_id for testing. Replace with your actual app_id in production
  endpoint: process.env.REACT_APP_WS_URL,
});

// Set SmartCharts public path

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
