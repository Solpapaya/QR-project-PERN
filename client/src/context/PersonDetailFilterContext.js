import React, { useState, createContext } from "react";

export const PersonDetailFilterContext = createContext();

export const PersonDetailFilterContextProvider = (props) => {
  const [yearTaxReceiptFilter, setYearTaxReceiptFilter] = useState("all");
  const [monthTaxReceiptFilter, setMonthTaxReceiptFilter] = useState("all");
  const [yearStatusLogFilter, setYearStatusLogFilter] = useState("all");
  const [monthStatusLogFilter, setMonthStatusLogFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <PersonDetailFilterContext.Provider
      value={{
        yearTaxReceiptFilter,
        setYearTaxReceiptFilter,
        monthTaxReceiptFilter,
        setMonthTaxReceiptFilter,
        yearStatusLogFilter,
        setYearStatusLogFilter,
        monthStatusLogFilter,
        setMonthStatusLogFilter,
        statusFilter,
        setStatusFilter,
      }}
    >
      {props.children}
    </PersonDetailFilterContext.Provider>
  );
};
