import React, { useContext, useEffect } from "react";
import DeletedTaxReceiptFilter from "./DeletedTaxReceiptFilter";
import { fetchData } from "../../../global/functions/fetchData";
import { DeletedTaxReceiptsContext } from "../context/DeletedTaxReceiptsContext";
import TaxReceiptsList from "./TaxReceiptsList";

const DeletedTaxReceipts = () => {
  const {
    initialSearch,
    setInitialSearch,
    setTaxReceipts,
    setIsSearchSuccessful,
  } = useContext(DeletedTaxReceiptsContext);

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
          <DeletedTaxReceiptFilter />
          {/* <SearchTaxReceiptFilter /> <TaxReceiptsList /> */}
        </>
      )}
    </>
  );
};

export default DeletedTaxReceipts;
