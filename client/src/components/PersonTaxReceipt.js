import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import PersonTaxReceiptFilter from "./PersonTaxReceiptFilter";
import PersonTaxReceiptsList from "./PersonTaxReceiptsList";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { fetchData } from "../functions/fetchData";

const PersonTaxReceipt = () => {
  const { setTaxReceipts, taxInitialSearch, setTaxInitialSearch, setGotTaxes } =
    useContext(PersonTaxReceiptsContext);

  const rfcParam = useParams().rfc;

  const getAllTaxReceipts = async () => {
    try {
      const response = await fetchData("get", `/taxreceipts/${rfcParam}`);
      setTaxReceipts(response.data.tax_receipts);
      setGotTaxes(true);
    } catch (err) {
      // No tax receipts for that person
      setGotTaxes(false);
    }
    setTaxInitialSearch(true);
  };

  useEffect(() => {
    getAllTaxReceipts();
  }, []);
  return (
    <>
      <PersonTaxReceiptFilter />
      {taxInitialSearch && <PersonTaxReceiptsList />}
    </>
  );
};

export default PersonTaxReceipt;
