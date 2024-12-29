import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// For debugging - check if env variables are loaded
console.log("Environment Variables:", {
  port: process.env.REACT_APP_PORT,
  wsPort: process.env.REACT_APP_WS_PORT,
  appId: process.env.REACT_APP_ID,
  wsUrl: process.env.REACT_APP_WS_URL,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
