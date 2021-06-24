import React, { useEffect, useContext } from "react";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import PersonStatusLogsTable from "./PersonStatusLogsTable";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { PersonDetailContext } from "../context/PersonDetailsContext";
import { PersonSubsectionContext } from "../context/PersonSubsectionContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const PersonStatusLogsList = () => {
  const {
    statusLogs,
    setGotLogs,
    gotLogs,
    setFilteredStatusLogs,
    yearStatusLogFilter,
    monthStatusLogFilter,
    statusFilter,
    setYearStatusLogFilter,
    setMonthStatusLogFilter,
    setStatusFilter,
  } = useContext(PersonStatusLogsContext);

  const { months } = useContext(MonthsContext);
  const { personSection } = useContext(PersonSubsectionContext);

  const { exportBtn } = useContext(ExportBtnContext);
  const { setPerson } = useContext(PersonDetailContext);

  const exportToCSV = () => {
    let status;
    let year;
    let month;
    let statusFil;

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
        statusFil = prevStatusFilter;
        return prevStatusFilter;
      });

      exportData(status, year, month, statusFil);
    } else {
      // Alert user the table is empty and can not an empty table
      console.log("Table is empty");
    }
  };

  const exportData = (status, year, month, statusFil) => {
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
    const fileName = setExportFileName(year, month, statusFil);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const setExportFileName = (year, month, statusFil) => {
    let fileName = "CambiosDeEstado";

    setPerson((prevPerson) => {
      fileName += `_${prevPerson.first_name}${prevPerson.second_name}${prevPerson.surname}${prevPerson.second_surname}_${prevPerson.rfc}`;
      return prevPerson;
    });

    if (year !== "all") fileName += `_${year}`;

    if (month !== "all") fileName += `_${month}`;

    if (statusFil === "active") fileName += "_Activo";
    else if (statusFil === "disabled") fileName += "_Inactivo";

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

  const filterStatusLogs = () => {
    let newStatusLogs = [];
    if (monthStatusLogFilter === "all") {
      newStatusLogs = [...statusLogs];
    } else {
      const month = months.indexOf(monthStatusLogFilter) + 1;
      newStatusLogs = statusLogs.filter(
        (log) => parseInt(log.date.split("/")[1]) === month
      );
    }
    if (yearStatusLogFilter === "all") {
      newStatusLogs = [...newStatusLogs];
    } else {
      newStatusLogs = newStatusLogs.filter((log) => {
        return parseInt(log.date.split("/")[2]) === yearStatusLogFilter;
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
    if (newStatusLogs.length === 0) setGotLogs(false);
    else setGotLogs(true);
  };

  useEffect(() => {
    filterStatusLogs();
  }, [yearStatusLogFilter, monthStatusLogFilter, statusFilter, statusLogs]);

  useEffect(() => {
    // Code for resetting click events listeners in Export Button
    const new_element = exportBtn.current.cloneNode(true);
    exportBtn.current.parentNode.replaceChild(new_element, exportBtn.current);
    new_element.addEventListener("click", exportToCSV);
    exportBtn.current = new_element;
  }, [personSection]);

  return (
    <div>
      {gotLogs ? (
        <PersonStatusLogsTable />
      ) : (
        "Esta persona no tiene cambios de estado"
      )}
    </div>
  );
};

export default PersonStatusLogsList;
