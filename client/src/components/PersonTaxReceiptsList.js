import React, { useEffect, useContext } from "react";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import PersonTaxReceiptsTable from "./PersonTaxReceiptsTable";
import { MonthsContext } from "../context/MonthsContext";

const PersonTaxReceiptsList = () => {
  const {
    taxReceipts,
    setGotTaxes,
    gotTaxes,
    setFilteredTaxReceipts,
    yearTaxReceiptFilter,
    monthTaxReceiptFilter,
  } = useContext(PersonTaxReceiptsContext);
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

    setFilteredTaxReceipts(newTaxReceipts);
    if (newTaxReceipts.length === 0) setGotTaxes(false);
    else setGotTaxes(true);
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

export default PersonTaxReceiptsList;
