import React, { useContext, useEffect } from "react";
import DeletedSubsections from "../components/DeletedSubsections";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { DeletedSubsectionContext } from "../context/DeletedSubsectionContext";

const Deleted = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const { deletedSection } = useContext(DeletedSubsectionContext);

  const sections = ["Comprobantes Fiscales", "Usuarios"];

  useEffect(() => {
    setCurrentSection(5);
  }, []);
  return (
    <>
      <h2>{`${sections[deletedSection - 1]} Eliminados`}</h2>
      <DeletedSubsections />
      {/* {departmentSection === 1 ? <AddDepartment /> : <EditDepartmentsTable />} */}
    </>
  );
};

export default Deleted;
