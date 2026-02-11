import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found in index.html!");
}

createRoot(rootElement).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);