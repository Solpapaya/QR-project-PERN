import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { ReactComponent as Pencil } from "../../../global/icons/pencil.svg";
import { ReactComponent as Trash } from "../../../global/icons/trash.svg";
import { AlertContext } from "../../../global/context/AlertContext";
import { fetchData } from "../../../global/functions/fetchData";

const PersonTaxReceiptsTable = () => {
  const {
    filteredTaxReceipts,
    setFilteredTaxReceipts,
    taxReceipts,
    setTaxReceipts,
  } = useContext(PersonTaxReceiptsContext);
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
  const { months } = useContext(MonthsContext);

  let history = useHistory();

  const deleteHandler = async (tax) => {
    setTax(tax);
    const { full_name, month, year } = tax;
    const msg = [
      `¿Estás seguro de que quieres eliminar este comprobante?`,
      [`De:`, ` ${full_name}`],
      [`Año:`, ` ${year}`],
      [`Mes:`, ` ${months[month - 1]}`],
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
      const { id } = tax;
      const headers = { token: localStorage.token };
      const response = await fetchData("delete", `/taxreceipts/${id}`, {
        why_tax_deleted: warning.whyTaxDeleted,
        headers,
      });
      const { full_name, month, year } = response.data;
      setAlert({
        success: true,
        msg: [
          "El comprobante se ha borrado correctamente",
          [`De:`, ` ${full_name}`],
          [`Año:`, ` ${year}`],
          [`Mes:`, ` ${months[month - 1]}`],
        ],
        removeOnEnter: false,
      });
      setShowAlert(true);

      const newTaxReceipts = taxReceipts.filter((tax) => {
        return tax.id !== id;
      });
      setTaxReceipts(newTaxReceipts);

      // Tell user that the receipt was successfully deleted
    } catch (err) {
      // Alert that tells the user that the tax receipt could not be deleted
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
      setShowAlert(true);
    }
    setWarningOk(false);
    // try {
    //   await fetchData("delete", `/taxreceipts/${id}`);
    //   const newTaxReceipts = filteredTaxReceipts.filter((tax) => tax.id !== id);
    //   setFilteredTaxReceipts(newTaxReceipts);

    //   // Tell user that the receipt was successfully deleted
    // } catch (err) {
    //   // Alert that tells the user that the tax receipt could not be deleted
    // }
  };

  useEffect(() => {
    warningOk.deleteTaxReceipt && deleteTaxReceipt();
  }, [warningOk]);

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
                    onClick={() => deleteHandler(tax)}
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
