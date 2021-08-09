import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { ReactComponent as Pencil } from "../../../global/icons/pencil.svg";
import { ReactComponent as Trash } from "../../../global/icons/trash.svg";
// import { fetchData } from "../functions/fetchData";
import { AlertContext } from "../../../global/context/AlertContext";
import { fetchData } from "../../../global/functions/fetchData";

const TaxReceiptsTable = () => {
  const { filteredTaxReceipts, setFilteredTaxReceipts } = useContext(
    SearchTaxReceiptsContext
  );
  const [tax, setTax] = useState({});
  const {
    warning,
    setShowWarning,
    setWarning,
    warningOk,
    setWarningOk,
    setAlert,
    setShowAlert,
  } = useContext(AlertContext);
  // Month Array for convertion
  const { months } = useContext(MonthsContext);

  let history = useHistory();

  const deleteHandler = async (tax) => {
    setTax(tax);
    const { full_name, month, year } = tax;
    const msg = [
      `¿Estás seguro de que quieres eliminar este comprobante?`,
      `De: ${full_name}`,
      `Año: ${year}`,
      `Mes: ${months[month - 1]}`,
    ];
    const secondaryMsg = "El comprobante ya no se podrá recuperar";
    setWarning({
      msg,
      secondaryMsg,
      class: "warning--delete warning--deleteTaxReceipt",
      type: "deleteTaxReceipt",
      activeMenu: "areYouSure",
    });
    setShowWarning(true);
  };

  const deleteTaxReceipt = async () => {
    try {
      const id = tax.id;

      const headers = { token: localStorage.token };
      const response = await fetchData("delete", `/taxreceipts/${id}`, {
        why_tax_deleted: warning.whyTaxDeleted,
        headers,
      });
      console.log({ response });
      const newTaxReceipts = filteredTaxReceipts.filter((tax) => {
        return tax.id !== id;
      });
      setFilteredTaxReceipts(newTaxReceipts);

      // Tell user that the receipt was successfully deleted
    } catch (err) {
      // Alert that tells the user that the tax receipt could not be deleted
    }
  };

  useEffect(() => {
    warningOk.deleteTaxReceipt && deleteTaxReceipt();
  }, [warningOk]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Año</th>
          <th>Mes</th>
          <th>Nombre Completo</th>
          <th>RFC</th>
          <th className="center-column">Editar</th>
          <th className="center-column">Borrar</th>
        </tr>
      </thead>
      <tbody>
        {filteredTaxReceipts.map((tax) => {
          const { id, year, month, full_name, rfc } = tax;
          return (
            <tr key={id}>
              <td>{year}</td>
              <td>{months[month - 1]}</td>
              <td>{full_name}</td>
              <td>{rfc}</td>
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
                    onClick={() => deleteHandler(tax)}
                    className="table-btn delete-btn"
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

export default TaxReceiptsTable;
