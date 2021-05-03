import React from "react";
import ReactDOM from "react-dom";
import "./app.css";
import App from "./App";
import { CurrentSectionContextProvider } from "./context/CurrentSectionContext";

ReactDOM.render(
  <React.StrictMode>
    <CurrentSectionContextProvider>
      <App />
    </CurrentSectionContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
