import React, { useState, createContext, useRef } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = (props) => {
  const [alert, setAlert] = useState({
    success: false,
    msg: "",
    removeOnEnter: true,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warning, setWarning] = useState({
    msg: "",
    secondaryMsg: "",
    class: "",
    type: "",
    activeMenu: "",
    whyTaxDeleted: "",
  });
  const [warningOk, setWarningOk] = useState({
    changePersonStatus: false,
    logOut: false,
    deleteTaxReceipt: false,
  });
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
