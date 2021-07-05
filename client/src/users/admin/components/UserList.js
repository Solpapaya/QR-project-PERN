import React, { useContext, useEffect } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { SearchUsersContext } from "../context/SearchUsersContext";
import UsersTable from "./UsersTable";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const UserList = () => {
  const {
    isSearchSuccessful,
    statusFilter,
    departmentFilter,
    setIsSearchSuccessful,
    users,
    setFilteredUsers,
    setStatusFilter,
    setDepartmentFilter,
  } = useContext(SearchUsersContext);

  const { exportBtn } = useContext(ExportBtnContext);
  const { searchSection } = useContext(SearchSubsectionContext);

  const exportToCSV = () => {
    let people;
    let status;
    let department;
    // For getting the latest value of the States
    setFilteredUsers((prevPeople) => {
      people = prevPeople;
      return prevPeople;
    });

    if (people.length > 0) {
      setStatusFilter((prevStatus) => {
        status = prevStatus;
        return prevStatus;
      });
      setDepartmentFilter((prevDepartment) => {
        department = prevDepartment;
        return prevDepartment;
      });
      exportData(people, status, department);
    } else {
      // Alert user the table is empty and can not an empty table
      console.log("Table is empty");
    }
  };

  const exportData = (people, status, department) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    // Adds the titles of each column like 'First Name' or 'RFC' , etc
    const exportTable = addHeaderToTable(people);
    const ws = XLSX.utils.json_to_sheet(exportTable, {
      skipHeader: true,
    });
    // Defines the width of each column
    ws["!cols"] = [
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
    ];
    // Sets the file name depending on the filters applied to the Data
    // If the table only shows active people, the file name should be
    // 'Person_Table_Active' or if the people shown in the browser are
    // people inactive from the Finance department, the name should be
    // 'Person_Table_Disabled_Finance'
    const fileName = setExportFileName(status, department);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const setExportFileName = (status, department) => {
    let fileName = "Tabla_Personas";

    if (status === "active") fileName += "_Activas";
    else if (status === "disabled") fileName += "_Inactivas";

    if (department === "null") fileName += "_SinAsignar";
    else if (department !== "all_areas")
      fileName += `_${department.replace(" ", "")}`;
    return fileName;
  };

  const addHeaderToTable = (obj) => {
    const header = {
      first_name: "Primer Nombre",
      second_name: "Segundo Nombre",
      surname: "Primer Apellido",
      second_surname: "Segundo Apellido",
      rfc: "RFC",
      department_name: "Área",
      creation_date: "Fecha de Alta",
      active: "Estado",
    };
    // Changes values true and false for 'Active' or 'Disabled'
    const newObj = obj.map((person) => {
      const newRow = { ...person };
      if (newRow.active) newRow.active = "Activo";
      else newRow.active = "Inactivo";
      return { ...newRow };
    });
    const exportTable = [header, ...newObj];
    return exportTable;
  };

  const filterUsers = () => {
    setFilteredUsers(users);
    setIsSearchSuccessful(true);
    // let newUsers;
    // switch (statusFilter) {
    //   case "active":
    //     newUsers = users.filter((person) => person.active === true);
    //     break;
    //   case "disabled":
    //     newUsers = users.filter((person) => person.active === false);
    //     break;
    //   default:
    //     newUsers = [...users];
    //     break;
    // }
    // if (departmentFilter === "all_areas") {
    //   newUsers = [...newUsers];
    // } else if (departmentFilter === "null") {
    //   newUsers = newUsers.filter((person) => person.department_name === null);
    // } else {
    //   newUsers = newUsers.filter(
    //     (person) => person.department_name === departmentFilter
    //   );
    // }
    // if (newUsers.length === 0) setIsSearchSuccessful(false);
    // else setIsSearchSuccessful(true);

    // setFilteredUsers(newUsers);
  };

  useEffect(() => {
    filterUsers();
  }, [users, statusFilter, departmentFilter]);

  // useEffect(() => {
  //   // Code for resetting click events listeners in Export Button
  //   const new_element = exportBtn.current.cloneNode(true);
  //   exportBtn.current.parentNode.replaceChild(new_element, exportBtn.current);
  //   new_element.addEventListener("click", exportToCSV);
  //   exportBtn.current = new_element;
  // }, [searchSection]);

  return (
    <div className="table-container">
      {isSearchSuccessful ? <UsersTable /> : "No Matches"}
    </div>
  );
};

export default UserList;
