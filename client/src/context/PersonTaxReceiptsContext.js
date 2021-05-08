import React, { useState, createContext } from "react";

export const PersonTaxReceiptsContext = createContext();

export const PersonTaxReceiptsContextProvider = (props) => {
  const [taxInitialSearch, setTaxInitialSearch] = useState(false);
  const [taxReceipts, setTaxReceipts] = useState([]);
  const [filteredTaxReceipts, setFilteredTaxReceipts] = useState([]);
  const [gotTaxes, setGotTaxes] = useState(false);

  return (
    <PersonTaxReceiptsContext.Provider
      value={{
        taxReceipts,
        setTaxReceipts,
        gotTaxes,
        setGotTaxes,
        taxInitialSearch,
        setTaxInitialSearch,
        filteredTaxReceipts,
        setFilteredTaxReceipts,
      }}
    >
      {props.children}
    </PersonTaxReceiptsContext.Provider>
  );
};
