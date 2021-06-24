import React, { useState, createContext } from "react";

export const LoadingContext = createContext();

export const LoadingContextProvider = (props) => {
  const [showLoading, setShowLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ showLoading, setShowLoading }}>
      {props.children}
    </LoadingContext.Provider>
  );
};
