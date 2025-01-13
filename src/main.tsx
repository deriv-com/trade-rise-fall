import { createRoot } from "react-dom/client";
import React from "react";
import AppInitializer from "./app/AppInitializer";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<AppInitializer />);
}
