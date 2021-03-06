// modCode Branch
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";
import { AuthContextProvider } from "./global/context/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
