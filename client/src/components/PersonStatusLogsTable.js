import React, { useContext } from "react";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { MonthsContext } from "../context/MonthsContext";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";

const PersonStatusLogsTable = () => {
  const { filteredStatusLogs } = useContext(PersonStatusLogsContext);
  const { months } = useContext(MonthsContext);

  return (
    <table className="table logs">
      <thead>
        <tr>
          <th>Fecha</th>
          <th className="center-column">Nuevo Estado</th>
        </tr>
      </thead>
      <tbody>
        {filteredStatusLogs.map((log) => {
          const { id, log_date, new_status } = log;
          const splittedDate = log_date.split("/");
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PersonStatusLogsTable;
