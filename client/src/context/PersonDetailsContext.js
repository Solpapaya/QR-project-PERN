import React, { useState, createContext } from "react";

export const PersonDetailContext = createContext();

export const PersonDetailContextProvider = (props) => {
  const [person, setPerson] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    rfc: "",
  });
  return (
    <PersonDetailContext.Provider value={{ person, setPerson }}>
      {props.children}
    </PersonDetailContext.Provider>
  );
};
