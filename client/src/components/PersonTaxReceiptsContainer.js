import React, { useEffect, useContext, useState } from "react";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { PersonDetailFilterContext } from "../context/PersonDetailFilterContext";
import PersonTaxReceiptsTable from "./PersonTaxReceiptsTable";
import { MonthsContext } from "../context/MonthsContext";

const PersonTaxReceiptsContainer = () => {
  const {
    setTaxReceipts,
    taxReceipts,
    setGotTaxes,
    gotTaxes,
    filteredTaxReceipts,
    setFilteredTaxReceipts,
  } = useContext(PersonTaxReceiptsContext);
  const { yearTaxReceiptFilter, monthTaxReceiptFilter } = useContext(
    PersonDetailFilterContext
  );
  const { months } = useContext(MonthsContext);

  const filterTaxReceipts = () => {
    let newTaxReceipts = [];
    if (monthTaxReceiptFilter === "all") {
      newTaxReceipts = [...taxReceipts];
    } else {
      const month = months.indexOf(monthTaxReceiptFilter) + 1;
      newTaxReceipts = taxReceipts.filter((tax) => tax.month === month);
    }
    if (yearTaxReceiptFilter === "all") {
      newTaxReceipts = [...newTaxReceipts];
    } else {
      newTaxReceipts = newTaxReceipts.filter(
        (tax) => tax.year === yearTaxReceiptFilter
      );
    }
    if (newTaxReceipts.length === 0) {
      setGotTaxes(false);
    } else {
      setFilteredTaxReceipts(newTaxReceipts);
      setGotTaxes(true);
    }
  };

  useEffect(() => {
    filterTaxReceipts();
  }, [yearTaxReceiptFilter, monthTaxReceiptFilter, taxReceipts]);

  return (
    <div>
      {gotTaxes ? (
        <PersonTaxReceiptsTable />
      ) : (
        "Esta persona no tiene comprobantes fiscales"
      )}
    </div>
  );
};

export default PersonTaxReceiptsContainer;
