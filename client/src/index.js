import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";
import { CurrentSectionContextProvider } from "./context/CurrentSectionContext";
import { AlertContextProvider } from "./context/AlertContext";

ReactDOM.render(
  <React.StrictMode>
    <CurrentSectionContextProvider>
      <AlertContextProvider>
        <App />
      </AlertContextProvider>
    </CurrentSectionContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
