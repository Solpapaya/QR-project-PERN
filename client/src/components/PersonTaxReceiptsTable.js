import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";
import { fetchData } from "../functions/fetchData";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { PersonDetailContext } from "../context/PersonDetailsContext";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const PersonTaxReceiptsTable = () => {
  const {
    filteredTaxReceipts,
    setFilteredTaxReceipts,
    setYearTaxReceiptFilter,
    setMonthTaxReceiptFilter,
  } = useContext(PersonTaxReceiptsContext);
  const { months } = useContext(MonthsContext);
  const { exportBtn } = useContext(ExportBtnContext);
  const { setPerson } = useContext(PersonDetailContext);

  let history = useHistory();

  const deleteHandler = async (id) => {
    try {
      await fetchData("delete", `/taxreceipts/${id}`);
      const newTaxReceipts = filteredTaxReceipts.filter((tax) => tax.id !== id);
      setFilteredTaxReceipts(newTaxReceipts);

      // Tell user that the receipt was successfully deleted
    } catch (err) {
      // Alert that tells the user that the tax receipt could not be deleted
    }
  };

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
      setYearTaxReceiptFilter((prevYear) => {
        year = prevYear;
        return prevYear;
      });
      setMonthTaxReceiptFilter((prevMonth) => {
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
    let fileName = "Comprobantes";
    setPerson((prevPerson) => {
      fileName += `_${prevPerson.first_name}${prevPerson.second_name}${prevPerson.surname}${prevPerson.second_surname}_${prevPerson.rfc}`;
      return prevPerson;
    });

    if (year !== "all") fileName += `_${year}`;

    if (month !== "all") fileName += `_${month}`;

    return fileName;
  };

  const addHeaderToTable = (obj) => {
    const header = {
      year: "Año",
      month: "Mes",
    };

    const newObj = obj.map((tax) => {
      const newRow = { ...tax, id: null };
      newRow.month = months[newRow.month - 1];
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
    <table className="table taxes">
      <thead>
        <tr>
          <th>Año</th>
          <th>Mes</th>
          <th className="center-column">Editar</th>
          <th className="center-column">Borrar</th>
        </tr>
      </thead>
      <tbody>
        {filteredTaxReceipts.map((tax) => {
          const { id, month, year } = tax;
          return (
            <tr
              key={id}
              // className="person-row"
              // onClick={() => personSelectHandler(rfc)}
            >
              <td>{year}</td>
              <td>{months[month - 1]}</td>
              <td>
                <div className="center-container">
                  <button
                    className="table-btn edit-btn"
                    onClick={() => history.push(`/taxreceipt/${id}/update`)}
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    className="table-btn delete-btn"
                    onClick={() => deleteHandler(id)}
                  >
                    <Trash />
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

export default PersonTaxReceiptsTable;
