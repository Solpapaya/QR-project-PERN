import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DeletedTaxReceiptsContext } from "../context/DeletedTaxReceiptsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { ReactComponent as Pencil } from "../../../global/icons/pencil.svg";
import { ReactComponent as Trash } from "../../../global/icons/trash.svg";
import { AlertContext } from "../../../global/context/AlertContext";
import { fetchData } from "../../../global/functions/fetchData";

const TaxReceiptsTable = () => {
  const { filteredTaxReceipts, setFilteredTaxReceipts } = useContext(
    DeletedTaxReceiptsContext
  );

  // Month Array for convertion
  const { months } = useContext(MonthsContext);

  let history = useHistory();

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
