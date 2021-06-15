import React, { useEffect, useContext } from "react";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import TaxReceiptsTable from "./TaxReceiptsTable";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const TaxReceiptsList = () => {
  const {
    taxReceipts,
    isSearchSuccessful,
    setIsSearchSuccessful,
    yearFilter,
    monthFilter,
    setYearFilter,
    setMonthFilter,
    setFilteredTaxReceipts,
  } = useContext(SearchTaxReceiptsContext);

  const { months } = useContext(MonthsContext);
  const { exportBtn } = useContext(ExportBtnContext);
  const { searchSection } = useContext(SearchSubsectionContext);

  const exportToCSV = () => {
    let taxes;
    let year;
    let month;

    // For getting the latest value of the States
    setFilteredTaxReceipts((prevTaxes) => {
      taxes = prevTaxes;
      return prevTaxes;
    });

    if (taxes.length > 0) {
      setYearFilter((prevYear) => {
        year = prevYear;
        return prevYear;
      });
      setMonthFilter((prevMonth) => {
        month = prevMonth;
        return prevMonth;
      });

      exportData(taxes, year, month);
    } else {
      // Alert user the table is empty and can not an empty table
      console.log("Table is empty");
    }
  };

  const exportData = (taxes, year, month) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    // Adds the titles of each column like 'First Name' or 'RFC' , etc
    const exportTable = addHeaderToTable(taxes);
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
    const fileName = setExportFileName(year, month);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const setExportFileName = (year, month) => {
    let fileName = "Tabla_Comprobantes";

    if (year !== "all") fileName += `_${year}`;

    if (month !== "all") fileName += `_${month}`;

    return fileName;
  };

  const addHeaderToTable = (obj) => {
    const header = {
      year: "Año",
      month: "Mes",
      full_name: "Nombre Completo",
      rfc: "RFC",
    };

    const newObj = obj.map((tax) => {
      const newRow = { ...tax, id: null };
      newRow.month = months[newRow.month - 1];
      return newRow;
    });

    const exportTable = [header, ...newObj];
    return exportTable;
  };

  const filterTaxReceipts = () => {
    let newTaxReceipts = [];
    if (yearFilter === "all") newTaxReceipts = [...taxReceipts];
    else newTaxReceipts = taxReceipts.filter((tax) => tax.year === yearFilter);
    if (monthFilter === "all") newTaxReceipts = [...newTaxReceipts];
    else {
      const index = months.indexOf(monthFilter);
      newTaxReceipts = newTaxReceipts.filter((tax) => tax.month === index + 1);
    }
    setFilteredTaxReceipts(newTaxReceipts);

    if (newTaxReceipts.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);
  };

  useEffect(() => {
    filterTaxReceipts();
  }, [yearFilter, monthFilter, taxReceipts]);

  useEffect(() => {
    // Code for resetting click events listeners in Export Button
    const new_element = exportBtn.current.cloneNode(true);
    exportBtn.current.parentNode.replaceChild(new_element, exportBtn.current);
    new_element.addEventListener("click", exportToCSV);
    exportBtn.current = new_element;
  }, [searchSection]);

  return (
    <div className="table-container">
      {isSearchSuccessful ? <TaxReceiptsTable /> : "No Matches"}
    </div>
  );
};

export default TaxReceiptsList;
