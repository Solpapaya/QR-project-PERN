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
          <th>Fecha del Comprobante</th>
          <th>Emisor del Comprobante</th>
          <th>Fecha de Eliminación</th>
          <th>Eliminado Por</th>
          <th>Motivo de Eliminación</th>
        </tr>
      </thead>
      <tbody>
        {filteredTaxReceipts.map((tax) => {
          const {
            id,
            tax_receipt_date,
            tax_emitter_full_name,
            rfc_tax_receipt_emitter,
            deleted_on_date,
            deleted_on_time,
            user_full_name,
            why_was_deleted,
            email,
          } = tax;
          const taxIssueSplittedDate = tax_receipt_date.split("/");
          const taxIssueFormattedDate = `${
            months[parseInt(taxIssueSplittedDate[1]) - 1]
          }, ${taxIssueSplittedDate[2]}`;
          const taxDeletedSplittedDate = deleted_on_date.split("/");
          const taxDeletedFormattedDate = `${
            months[parseInt(taxDeletedSplittedDate[1]) - 1]
          } ${taxDeletedSplittedDate[0]}, ${taxDeletedSplittedDate[2]}`;
          return (
            <tr key={id}>
              <td className="w-18">{taxIssueFormattedDate}</td>
              <td>
                <div className="flex-column">
                  <span>{tax_emitter_full_name}</span>
                  <span className="second-value">
                    {rfc_tax_receipt_emitter}
                  </span>
                </div>
              </td>
              <td>
                <div className="flex-column">
                  <span>{taxDeletedFormattedDate}</span>
                  <span className="second-value">{deleted_on_time}</span>
                </div>
              </td>
              <td className="w-20">
                <div className="flex-column">
                  <span>{user_full_name}</span>
                  <span className="second-value">{email}</span>
                </div>
              </td>
              <td>{why_was_deleted}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaxReceiptsTable;
