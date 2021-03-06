import React, { useContext, useEffect } from "react";
import SearchTaxReceiptFilter from "./SearchTaxReceiptFilter";
import { fetchData } from "../../../global/functions/fetchData";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import TaxReceiptsList from "./TaxReceiptsList";

const TaxReceipts = () => {
  const {
    initialSearch,
    setInitialSearch,
    setTaxReceipts,
    setIsSearchSuccessful,
  } = useContext(SearchTaxReceiptsContext);

  const getAllTaxReceipts = async () => {
    try {
      const response = await fetchData("get", "/taxreceipts");
      setTaxReceipts(response.data.tax_receipts);
      setIsSearchSuccessful(true);
    } catch (err) {
      setIsSearchSuccessful(false);
    }
    setInitialSearch(true);
  };

  useEffect(() => {
    getAllTaxReceipts();
  }, []);
  return (
    <>
      {initialSearch && (
        <>
          <SearchTaxReceiptFilter /> <TaxReceiptsList />
        </>
      )}
    </>
  );
};

export default TaxReceipts;
