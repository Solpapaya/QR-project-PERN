import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import PersonSubsections from "../components/PersonSubsections";
import { PersonSubsectionContext } from "../context/PersonSubsectionContext";
import { fetchData } from "../functions/fetchData";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import PersonTaxReceipt from "../components/PersonTaxReceipt";
import { PersonTaxReceiptsContextProvider } from "../context/PersonTaxReceiptsContext";
import { PersonStatusLogsContextProvider } from "../context/PersonStatusLogsContext";
import PersonStatusLog from "../components/PersonStatusLog";

const PersonDetailPage = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const { personSection } = useContext(PersonSubsectionContext);

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

  useEffect(() => {
    setCurrentSection(1);
    getPerson();
  }, []);
  return (
    <div>
      <h2>{`${person.first_name} ${person.second_name} ${person.surname} ${person.second_surname}`}</h2>
      <h4>{person.rfc}</h4>
      <PersonSubsections />
      {personSection === 1 ? (
        <PersonTaxReceiptsContextProvider>
          <PersonTaxReceipt />
        </PersonTaxReceiptsContextProvider>
      ) : (
        <PersonStatusLogsContextProvider>
          <PersonStatusLog />
        </PersonStatusLogsContextProvider>
      )}
    </div>
  );
};

export default PersonDetailPage;
