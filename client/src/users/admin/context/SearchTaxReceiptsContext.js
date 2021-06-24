import React, { useState, createContext } from "react";

export const SearchTaxReceiptsContext = createContext();

export const SearchTaxReceiptsContextProvider = (props) => {
  const [isSearchSuccessful, setIsSearchSuccessful] = useState(true);
  const [initialSearch, setInitialSearch] = useState(false);
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [taxReceipts, setTaxReceipts] = useState([]);
  const [filteredTaxReceipts, setFilteredTaxReceipts] = useState(taxReceipts);
  //   const [sort, setSort] = useState("surname");

  return (
    <SearchTaxReceiptsContext.Provider
      value={{
        isSearchSuccessful,
        setIsSearchSuccessful,
        initialSearch,
        setInitialSearch,
        yearFilter,
        setYearFilter,
        monthFilter,
        setMonthFilter,
        taxReceipts,
        setTaxReceipts,
        filteredTaxReceipts,
        setFilteredTaxReceipts,
        // sort,
        // setSort,
      }}
    >
      {props.children}
    </SearchTaxReceiptsContext.Provider>
  );
};
