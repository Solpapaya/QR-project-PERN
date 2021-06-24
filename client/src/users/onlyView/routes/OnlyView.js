import React from "react";
import { CurrentSectionContextProvider } from "../context/CurrentSectionContext";
import Routes from "./Routes";

const OnlyView = () => {
  return (
    <CurrentSectionContextProvider>
      <Routes />
    </CurrentSectionContextProvider>
  );
};

export default OnlyView;
