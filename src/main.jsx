import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./contexts/UserStaticContext.jsx";
import { Analytics } from "@vercel/analytics/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
      <Analytics />
    </UserProvider>
  </React.StrictMode>
);
