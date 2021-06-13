import React, { useContext, useEffect } from "react";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { MonthsContext } from "../context/MonthsContext";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { PersonDetailContext } from "../context/PersonDetailsContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const PersonStatusLogsTable = () => {
  const {
    filteredStatusLogs,
    setFilteredStatusLogs,
    setYearStatusLogFilter,
    setMonthStatusLogFilter,
    setStatusFilter,
  } = useContext(PersonStatusLogsContext);
  const { months } = useContext(MonthsContext);
  const { exportBtn } = useContext(ExportBtnContext);
  const { setPerson } = useContext(PersonDetailContext);

  const exportToCSV = () => {
    let status;
    let year;
    let month;
    let statusFilter;

    // For getting the latest value of the States
    setFilteredStatusLogs((prevStatus) => {
      status = prevStatus;
      return prevStatus;
    });

    // If the table is not empty
    if (status.length > 0) {
      setYearStatusLogFilter((prevYear) => {
        year = prevYear;
        return prevYear;
      });
      setMonthStatusLogFilter((prevMonth) => {
        month = prevMonth;
        return prevMonth;
      });
      setStatusFilter((prevStatusFilter) => {
        statusFilter = prevStatusFilter;
        return prevStatusFilter;
      });

      exportData(status, year, month, statusFilter);
    } else {
      // Alert user the table is empty and can not an empty table
      console.log("Table is empty");
    }
  };

  const exportData = (status, year, month, statusFilter) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    // Adds the titles of each column like 'First Name' or 'RFC' , etc
    const exportTable = addHeaderToTable(status);
    const ws = XLSX.utils.json_to_sheet(exportTable, {
      skipHeader: true,
    });
    // Defines the width of each column
    ws["!cols"] = [{ width: 15 }, { width: 20 }];
    // Sets the file name depending on the filters applied to the Data
    // If the table only shows active people, the file name should be
    // 'Person_Table_Active' or if the people shown in the browser are
    // people inactive from the Finance department, the name should be
    // 'Person_Table_Disabled_Finance'
    const fileName = setExportFileName(year, month, statusFilter);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const setExportFileName = (year, month, statusFilter) => {
    let fileName = "CambiosDeEstado";

    setPerson((prevPerson) => {
      fileName += `_${prevPerson.first_name}${prevPerson.second_name}${prevPerson.surname}${prevPerson.second_surname}_${prevPerson.rfc}`;
      return prevPerson;
    });

    if (year !== "all") fileName += `_${year}`;

    if (month !== "all") fileName += `_${month}`;

    if (statusFilter === "active") fileName += "_Activo";
    else if (statusFilter === "disabled") fileName += "_Inactivo";

    return fileName;
  };

  const addHeaderToTable = (obj) => {
    const header = {
      date: "Fecha",
      new_status: "Nuevo Estado",
    };

    const newObj = obj.map((tax) => {
      // Removes id, it will not appear in the CSV exported file
      const newRow = { ...tax, id: null };
      if (newRow.new_status) newRow.new_status = "Activo";
      else newRow.new_status = "Inactivo";
      return newRow;
    });

    const exportTable = [header, ...newObj];
    return exportTable;
  };

  useEffect(() => {
    // Code for resetting click events listeners in Export Button
    const new_element = exportBtn.current.cloneNode(true);
    exportBtn.current.parentNode.replaceChild(new_element, exportBtn.current);
    new_element.addEventListener("click", exportToCSV);
    exportBtn.current = new_element;
  }, []);

  return (
    <table className="table logs">
      <thead>
        <tr>
          <th>Fecha</th>
          <th className="center-column">Nuevo Estado</th>
        </tr>
      </thead>
      <tbody>
        {filteredStatusLogs.map((log) => {
          const { id, date, new_status } = log;
          const splittedDate = date.split("/");
          const formattedDate = `${months[parseInt(splittedDate[1]) - 1]} ${
            splittedDate[0]
          }, ${splittedDate[2]}`;
          return (
            <tr
              key={id}
              //   className="person-row"
              // onClick={() => personSelectHandler(rfc)}
            >
              <td>{formattedDate}</td>
              <td>
                <div className="person-status">
                  {new_status ? (
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PersonStatusLogsTable;
