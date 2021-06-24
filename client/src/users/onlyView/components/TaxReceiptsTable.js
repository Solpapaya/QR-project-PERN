import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { ReactComponent as Pencil } from "../../../global/icons/pencil.svg";
import { ReactComponent as Trash } from "../../../global/icons/trash.svg";
// import { fetchData } from "../functions/fetchData";
import { AlertContext } from "../../../global/context/AlertContext";

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
    const msg = [
      `¿Estás seguro de que quieres eliminar este comprobante?`,
      `De: ${full_name}`,
      `Año: ${year}`,
      `Mes: ${months[month - 1]}`,
    ];
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaxReceiptsTable;
