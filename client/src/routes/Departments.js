import React, { useContext, useEffect } from "react";
import AddDepartment from "../components/AddDepartment";
import DepartmentSubsections from "../components/DepartmentSubsections";
import EditDepartmentsTable from "../components/EditDepartmentsTable";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { DepartmentSubsectionContext } from "../context/DepartmentSubsectionContext";

const Departments = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const { departmentSection } = useContext(DepartmentSubsectionContext);

  useEffect(() => {
    setCurrentSection(4);
  }, []);
  return (
    <>
      <h2 className="header">Areas</h2>
      <DepartmentSubsections />
      {departmentSection === 1 ? <AddDepartment /> : <EditDepartmentsTable />}
    </>
  );
};

export default Departments;
