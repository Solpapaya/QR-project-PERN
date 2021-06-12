import React, { useRef, createContext } from "react";

export const ExportBtnContext = createContext();

export const ExportBtnContextProvider = (props) => {
  const exportBtn = useRef(null);

  return (
    <ExportBtnContext.Provider value={{ exportBtn }}>
      {props.children}
    </ExportBtnContext.Provider>
  );
};
