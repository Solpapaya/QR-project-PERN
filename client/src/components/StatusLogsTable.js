import React, { useContext, useEffect } from "react";
import { SearchStatusLogsContext } from "../context/SearchStatusLogsContext";
import { MonthsContext } from "../context/MonthsContext";

import { ExportBtnContext } from "../context/ExportBtnContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const StatusLogsTable = () => {
  const {
    filteredStatusLogs,
    setFilteredStatusLogs,
    setYearFilter,
    setMonthFilter,
    setStatusFilter,
  } = useContext(SearchStatusLogsContext);
  const { months } = useContext(MonthsContext);
  const { exportBtn } = useContext(ExportBtnContext);

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
      setYearFilter((prevYear) => {
        year = prevYear;
        return prevYear;
      });
      setMonthFilter((prevMonth) => {
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
    ws["!cols"] = [{ width: 15 }, { width: 20 }, { width: 40 }, { width: 20 }];
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
    let fileName = "Tabla_CambiosDeEstado";

    if (year !== "all") fileName += `_${year}`;

    if (month !== "all") fileName += `_${month}`;

    if (statusFilter === "active") fileName += "_Activas";
    else if (statusFilter === "disabled") fileName += "_Inactivas";

    return fileName;
  };

  const addHeaderToTable = (obj) => {
    const header = {
      date: "Fecha",
      new_status: "Nuevo Estado",
      full_name: "Nombre Completo",
      rfc: "RFC",
    };

    const newObj = obj.map((tax) => {
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
    <table className="table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th className="center-column">Nuevo Estado</th>
          <th>Nombre Completo</th>
          <th>RFC</th>
        </tr>
      </thead>
      <tbody>
        {filteredStatusLogs.map((log) => {
          const { id, date, new_status, full_name, rfc } = log;
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
              <td>{full_name}</td>
              <td>{rfc}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StatusLogsTable;
