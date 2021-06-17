import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";
import { CurrentSectionContextProvider } from "./context/CurrentSectionContext";
import { AlertContextProvider } from "./context/AlertContext";
import { LoadingContextProvider } from "./context/LoadingContext";

ReactDOM.render(
  <React.StrictMode>
    <CurrentSectionContextProvider>
      <AlertContextProvider>
        <LoadingContextProvider>
          <App />
        </LoadingContextProvider>
      </AlertContextProvider>
    </CurrentSectionContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
