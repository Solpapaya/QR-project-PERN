import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { ReactComponent as Pencil } from "../../../global/icons/pencil.svg";
import { ReactComponent as Trash } from "../../../global/icons/trash.svg";
import { fetchData } from "../../../global/functions/fetchData";

const PersonTaxReceiptsTable = () => {
  const { filteredTaxReceipts, setFilteredTaxReceipts } = useContext(
    PersonTaxReceiptsContext
  );
  const { months } = useContext(MonthsContext);

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
