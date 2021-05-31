import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";

const TaxReceiptsTable = () => {
  const { filteredTaxReceipts, isSearchSuccessful } = useContext(
    SearchTaxReceiptsContext
  );
  // Month Array for convertion
  const { months } = useContext(MonthsContext);

  let history = useHistory();

  // const months = [
  //   "Enero",
  //   "Febrero",
  //   "Marzo",
  //   "Abril",
  //   "Mayo",
  //   "Junio",
  //   "Julio",
  //   "Agosto",
  //   "Septiembre",
  //   "Octubre",
  //   "Noviembre",
  //   "Diciembre",
  // ];

  // const deleteHandler = async (e, id) => {
  //   e.stopPropagation();
  //   try {
  //     const response = await fetchData(
  //       "delete",
  //       `/taxreceipts?rfc=${rfcParam}&id=${id}`
  //     );
  //     const newTaxReceipts = taxReceipts.filter((tax) => {
  //       return tax.id !== id;
  //     });
  //     setTaxReceipts(newTaxReceipts);
  //   } catch (err) {
  //     // Alert that tells the user that the tax receipt could not be deleted
  //   }
  // };

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
                    // onClick={(e) => disableHandler(e, { ...person })}
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
