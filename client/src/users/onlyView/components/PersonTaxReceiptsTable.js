import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PersonTaxReceiptsTable;
