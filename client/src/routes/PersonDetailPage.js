import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TaxReceiptsTable from "../components/TaxReceiptsTable";
import { fetchData } from "../functions/fetchData";

const PersonDetailPage = () => {
  const [taxReceipts, setTaxReceipts] = useState([]);
  const [gotTaxes, setGotTaxes] = useState(false);

  const [person, setPerson] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    rfc: "",
  });
  const rfcParam = useParams().rfc;

  const getPerson = async () => {
    const response = await fetchData("get", `/people/${rfcParam}`);
    const foundPerson = response.data.person;
    if (foundPerson.second_name) setPerson({ ...foundPerson });
    else setPerson({ ...foundPerson, second_name: "" });
  };

  const getTaxReceipts = async () => {
    try {
      const response = await fetchData("get", `/taxreceipts/${rfcParam}`);
      // console.log(response);
      setTaxReceipts(response.data.tax_receipts);
      setGotTaxes(true);
    } catch (err) {
      // No tax receipts for that person
    }
  };

  useEffect(() => {
    getPerson();
    getTaxReceipts();
  }, []);
  return (
    <div>
      <h1>{`${person.first_name} ${person.second_name} ${person.surname} ${person.second_surname}`}</h1>
      <h4>{person.rfc}</h4>
      {gotTaxes ? (
        <TaxReceiptsTable
          taxReceipts={taxReceipts}
          setTaxReceipts={setTaxReceipts}
          rfcParam={rfcParam}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default PersonDetailPage;
