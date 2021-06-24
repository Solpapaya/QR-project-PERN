import React, { useState, createContext } from "react";

export const MonthsContext = createContext();

export const MonthsContextProvider = (props) => {
  const [months] = useState([
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ]);

  return (
    <MonthsContext.Provider value={{ months }}>
      {props.children}
    </MonthsContext.Provider>
  );
};
