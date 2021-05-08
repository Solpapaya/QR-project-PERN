import React, { useEffect, useContext } from "react";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";

const TaxReceiptsList = () => {
  const {
    taxReceipts,
    setTaxReceipts,
    setIsSearchSuccessful,
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    filteredTaxReceipts,
  } = useContext(SearchTaxReceiptsContext);

  const filterTaxReceipts = () => {
    console.log(yearFilter, monthFilter);
    let newTaxReceipts = [];
    if (yearFilter === "all") {
      newTaxReceipts = [...taxReceipts];
    }
    if (newTaxReceipts.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);
  };

  useEffect(() => {
    filterTaxReceipts();
  }, [yearFilter, monthFilter, taxReceipts]);
  return <div></div>;
};

export default TaxReceiptsList;
