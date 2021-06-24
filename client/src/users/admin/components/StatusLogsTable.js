import React, { useContext, useEffect } from "react";
import { SearchStatusLogsContext } from "../context/SearchStatusLogsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";

const StatusLogsTable = () => {
  const { filteredStatusLogs } = useContext(SearchStatusLogsContext);
  const { months } = useContext(MonthsContext);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th className="center-column">Nuevo Estado</th>
          <th>Nombre Completo</th>
          <th>RFC</th>
        </tr>
      </thead>
      <tbody>
        {filteredStatusLogs.map((log) => {
          const { id, date, new_status, full_name, rfc } = log;
          const splittedDate = date.split("/");
          const formattedDate = `${months[parseInt(splittedDate[1]) - 1]} ${
            splittedDate[0]
          }, ${splittedDate[2]}`;
          return (
            <tr
              key={id}
              //   className="person-row"
              // onClick={() => personSelectHandler(rfc)}
            >
              <td>{formattedDate}</td>
              <td>
                <div className="person-status">
                  {new_status ? (
                    <>
                      <span className="icon active"></span>
                      <span className="status-text">Activo</span>
                    </>
                  ) : (
                    <>
                      <span className="icon disabled"></span>
                      <span className="status-text">Inactivo</span>
                    </>
                  )}
                </div>
              </td>
              <td>{full_name}</td>
              <td>{rfc}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StatusLogsTable;
