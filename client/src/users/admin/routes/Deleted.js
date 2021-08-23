import React, { useContext, useEffect } from "react";
import DeletedSubsections from "../components/DeletedSubsections";
import { DeletedTaxReceiptsContextProvider } from "../context/DeletedTaxReceiptsContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { DeletedSubsectionContext } from "../context/DeletedSubsectionContext";
import DeletedTaxReceipts from "../components/DeletedTaxReceipts";

const Deleted = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const { deletedSection } = useContext(DeletedSubsectionContext);

  const sections = ["Comprobantes Fiscales"];

  useEffect(() => {
    setCurrentSection(5);
  }, []);
  return (
    <>
      <h2>{`${sections[deletedSection - 1]} Eliminados`}</h2>
      <DeletedSubsections />
      <DeletedTaxReceiptsContextProvider>
        <DeletedTaxReceipts />
      </DeletedTaxReceiptsContextProvider>
    </>
  );
};

export default Deleted;
