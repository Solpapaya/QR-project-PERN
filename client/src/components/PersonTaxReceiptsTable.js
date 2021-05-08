import React, { useContext } from "react";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";

const PersonTaxReceiptsTable = () => {
  const { filteredTaxReceipts } = useContext(PersonTaxReceiptsContext);
  const { months } = useContext(MonthsContext);

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
                    // onClick={(e) => updateHandler(e, rfc)}
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    className="table-btn delete-btn"
                    // onClick={(e) => updateHandler(e, rfc)}
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
