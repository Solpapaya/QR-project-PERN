import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchData } from "../functions/fetchData";
import { compareValues } from "../functions/compareValues";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Switch } from "../icons/switch.svg";
import { SearchContext } from "../context/SearchContext";
import { MonthsContext } from "../context/MonthsContext";
import { ExportBtnContext } from "../context/ExportBtnContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const PeopleTable = () => {
  const {
    sort,
    people,
    setPeople,
    filteredPeople,
    setFilteredPeople,
    setStatusFilter,
    setDepartmentFilter,
  } = useContext(SearchContext);
  const { months } = useContext(MonthsContext);
  const { exportBtn } = useContext(ExportBtnContext);
  let history = useHistory();

  const exportToCSV = () => {
    let people;
    let status;
    let department;
    // For getting the latest value of the States
    setFilteredPeople((prevPeople) => {
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

  const disableHandler = async (e, person) => {
    e.stopPropagation();
    const { rfc } = person;
    const newActive = { active: !person.active };
    try {
      const response = await fetchData(
        "put",
        `/people/${rfc}?field=active`,
        newActive
      );
      // console.log(response);
      const newPeople = people.map((person) => {
        if (person.rfc === rfc) {
          return { ...person, active: !person.active };
        }
        return person;
      });
      setPeople(newPeople);
    } catch (err) {
      // Create Alert
      // console.log(err);
    }
  };

  const updateHandler = (e, rfc) => {
    e.stopPropagation();
    history.push(`/people/${rfc}/update`);
  };

  const personSelectHandler = (rfc) => {
    history.push(`/people/${rfc}`);
  };

  const sortPeople = () => {
    let sortedPeople = [];
    sortedPeople = [...people].sort(compareValues(sort));
    setPeople(sortedPeople);
  };

  useEffect(() => {
    sortPeople();
  }, [sort]);

  useEffect(() => {
    // Code for resetting click events listeners in Export Button
    const new_element = exportBtn.current.cloneNode(true);
    exportBtn.current.parentNode.replaceChild(new_element, exportBtn.current);
    new_element.addEventListener("click", exportToCSV);
    exportBtn.current = new_element;
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <div className="flex-column">
              <span>Primer </span> <span>Nombre</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Segundo </span> <span>Nombre</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Primer </span> <span>Apellido</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Segundo </span> <span>Apellido</span>
            </div>
          </th>
          <th className="center-column">RFC</th>
          <th className="center-column">Area</th>
          <th className="center-column">
            <div className="flex-column">
              <span>Fecha</span> <span>de Alta</span>
            </div>
          </th>
          <th className="center-column">Estado</th>
          <th className="center-column">Editar</th>
          <th className="center-column">
            <div className="flex-column">
              <span>Activar </span> <span>Desactivar</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredPeople.map((person) => {
          const {
            id,
            first_name,
            second_name,
            surname,
            second_surname,
            rfc,
            active,
            department_name,
            creation_date,
          } = person;
          const splittedDate = creation_date.split("/");
          const formattedDate = `${months[parseInt(splittedDate[1]) - 1]} ${
            splittedDate[0]
          }, ${splittedDate[2]}`;
          return (
            <tr
              key={id}
              className="person-row"
              onClick={() => personSelectHandler(rfc)}
            >
              <td>{first_name}</td>
              <td>{second_name}</td>
              <td>{surname}</td>
              <td>{second_surname}</td>
              <td className="center-column">{rfc}</td>
              <td className="center-column">
                <div className="flex-column">
                  {department_name ? (
                    department_name
                      .split(" ")
                      .map((name, index) => <span key={index}>{name}</span>)
                  ) : (
                    <>
                      <span>Sin</span>
                      <span>Asignar</span>
                    </>
                  )}
                </div>
              </td>
              <td className="center-column">{formattedDate}</td>
              <td>
                <div className="person-status">
                  {active ? (
                    <>
                      <span className="icon active"></span>
                      <span className="status-text">Activo</span>
                    </>
                  ) : (
                    <>
                      <span className="icon disabled"></span>
                      <span className="status-text">Inactivo</span>
                    </>
                  )}
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    className="table-btn edit-btn"
                    onClick={(e) => updateHandler(e, rfc)}
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    onClick={(e) => disableHandler(e, { ...person })}
                    className="table-btn switch-btn"
                  >
                    <Switch />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PeopleTable;
