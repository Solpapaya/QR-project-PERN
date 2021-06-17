import React, { useState, createContext } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = (props) => {
  const [alert, setAlert] = useState({
    success: false,
    msg: "",
    removeOnEnter: true,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState("");
  const [warningOk, setWarningOk] = useState(false);
  return (
    <AlertContext.Provider
      value={{
        alert,
        setAlert,
        showAlert,
        setShowAlert,
        showWarning,
        setShowWarning,
        warning,
        setWarning,
        warningOk,
        setWarningOk,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};
