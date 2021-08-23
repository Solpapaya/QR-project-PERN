import React, { useEffect, useContext } from "react";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { SearchStatusLogsContext } from "../context/SearchStatusLogsContext";
import StatusLogsTable from "./StatusLogsTable";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const StatusLogsList = () => {
  const {
    statusLogs,
    isSearchSuccessful,
    setIsSearchSuccessful,
    yearFilter,
    monthFilter,
    statusFilter,
    setFilteredStatusLogs,
    setYearFilter,
    setMonthFilter,
    setStatusFilter,
  } = useContext(SearchStatusLogsContext);

  const { months } = useContext(MonthsContext);
  const { exportBtn } = useContext(ExportBtnContext);
  const { searchSection } = useContext(SearchSubsectionContext);

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

  const filterStatusLogs = () => {
    let newStatusLogs = [];
    if (monthFilter === "all") {
      newStatusLogs = [...statusLogs];
    } else {
      const month = months.indexOf(monthFilter) + 1;
      newStatusLogs = statusLogs.filter(
        (log) => parseInt(log.date.split("/")[1]) === month
      );
    }
    if (yearFilter === "all") {
      newStatusLogs = [...newStatusLogs];
    } else {
      newStatusLogs = newStatusLogs.filter((log) => {
        return parseInt(log.date.split("/")[2]) === yearFilter;
      });
    }
    if (statusFilter === "all") {
      newStatusLogs = [...newStatusLogs];
    } else if (statusFilter === "active") {
      newStatusLogs = newStatusLogs.filter((log) => log.new_status);
    } else {
      newStatusLogs = newStatusLogs.filter((log) => !log.new_status);
    }
    setFilteredStatusLogs(newStatusLogs);
    if (newStatusLogs.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);
  };

  useEffect(() => {
    filterStatusLogs();
  }, [yearFilter, monthFilter, statusFilter, statusLogs]);

  useEffect(() => {
    // Code for showing 'Export Table' Button
    exportBtn.current.style.display = "block";

    // Code for resetting click events listeners in Export Button
    const new_element = exportBtn.current.cloneNode(true);
    exportBtn.current.parentNode.replaceChild(new_element, exportBtn.current);
    new_element.addEventListener("click", exportToCSV);
    exportBtn.current = new_element;
  }, [searchSection]);

  return (
    <div className="table-container">
      {isSearchSuccessful ? <StatusLogsTable /> : "No Matches"}
    </div>
  );
};

export default StatusLogsList;
