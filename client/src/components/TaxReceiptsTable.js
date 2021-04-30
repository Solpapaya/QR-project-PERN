import React from "react";
import { fetchData } from "../functions/fetchData";

const TaxReceiptsTable = ({ taxReceipts, setTaxReceipts, rfcParam }) => {
  // Month Array for convertion
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const deleteHandler = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetchData(
        "delete",
        `/taxreceipts?rfc=${rfcParam}&id=${id}`
      );
      const newTaxReceipts = taxReceipts.filter((tax) => {
        return tax.id !== id;
      });
      setTaxReceipts(newTaxReceipts);
    } catch (err) {
      // Alert that tells the user that the tax receipt could not be deleted
    }
  };

  return (
    <table className="table table-hover table-dark">
      <thead>
        <tr className="bg-primary">
          <th scope="col">Año</th>
          <th scope="col">Mes</th>
          <th scope="col">Editar</th>
          <th scope="col">Borrar</th>
        </tr>
      </thead>
      <tbody>
        {taxReceipts.map((tax) => {
          const { id, month, year } = tax;
          return (
            <tr key={id}>
              <td>{year}</td>
              <td>{months[month - 1]}</td>
              <td>
                <button
                  // onClick={(e) => updateHandler(e, rfc)}
                  className="btn btn-warning"
                >
                  Editar
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => deleteHandler(e, id)}
                  className="btn btn-danger"
                >
                  Borrar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaxReceiptsTable;
