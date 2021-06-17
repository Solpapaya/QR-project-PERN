import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";
import { fetchData } from "../functions/fetchData";
import { AlertContext } from "../context/AlertContext";

const TaxReceiptsTable = () => {
  const { filteredTaxReceipts, setFilteredTaxReceipts } = useContext(
    SearchTaxReceiptsContext
  );
  const {
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
    const { full_name, month, year } = tax;
    const msg = `¿Estás seguro de que quieres eliminar el comprobante de '${full_name}'
    correspondiente al Mes: '${months[month - 1]}' y Año: '${year}'?`;
    const secondaryMsg = "El comprobante ya no se podrá recuperar";
    setWarning({ msg, secondaryMsg, class: "warning--delete" });
    setShowWarning(true);
    // try {
    //   await fetchData("delete", `/taxreceipts/${id}`);
    //   const newTaxReceipts = filteredTaxReceipts.filter((tax) => {
    //     return tax.id !== id;
    //   });
    //   setFilteredTaxReceipts(newTaxReceipts);

    //   // Tell user that the receipt was successfully deleted
    // } catch (err) {
    //   // Alert that tells the user that the tax receipt could not be deleted
    // }
  };

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
