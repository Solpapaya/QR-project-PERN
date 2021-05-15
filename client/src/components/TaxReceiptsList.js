import React, { useEffect, useContext } from "react";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import TaxReceiptsTable from "./TaxReceiptsTable";

const TaxReceiptsList = () => {
  const {
    taxReceipts,
    isSearchSuccessful,
    setIsSearchSuccessful,
    yearFilter,
    monthFilter,
    setFilteredTaxReceipts,
  } = useContext(SearchTaxReceiptsContext);

  const { months } = useContext(MonthsContext);

  const filterTaxReceipts = () => {
    let newTaxReceipts = [];
    if (yearFilter === "all") newTaxReceipts = [...taxReceipts];
    else newTaxReceipts = taxReceipts.filter((tax) => tax.year === yearFilter);
    if (monthFilter === "all") newTaxReceipts = [...newTaxReceipts];
    else {
      const index = months.indexOf(monthFilter);
      newTaxReceipts = newTaxReceipts.filter((tax) => tax.month === index + 1);
    }
    setFilteredTaxReceipts(newTaxReceipts);

    if (newTaxReceipts.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);
  };

  useEffect(() => {
    filterTaxReceipts();
  }, [yearFilter, monthFilter, taxReceipts]);
  return (
    <div className="table-container">
      {isSearchSuccessful ? <TaxReceiptsTable /> : "No Matches"}
    </div>
  );
};

export default TaxReceiptsList;
