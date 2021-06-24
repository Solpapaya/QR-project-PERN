import React from "react";
import { CurrentSectionContextProvider } from "../context/CurrentSectionContext";
import { LoadingContextProvider } from "../context/LoadingContext";
import Routes from "./Routes";

const Admin = () => {
  return (
    <CurrentSectionContextProvider>
      <LoadingContextProvider>
        <Routes />
      </LoadingContextProvider>
    </CurrentSectionContextProvider>
  );
};

export default Admin;
