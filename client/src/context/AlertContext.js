import React, { useState, createContext } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = (props) => {
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [showAlert, setShowAlert] = useState(false);
  return (
    <AlertContext.Provider
      value={{
        response,
        setResponse,
        showAlert,
        setShowAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};
