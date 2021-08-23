import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchData } from "../../../global/functions/fetchData";
import { compareValues } from "../../../global/functions/compareValues";
import { ReactComponent as Pencil } from "../../../global/icons/pencil.svg";
import { ReactComponent as Trash } from "../../../global/icons/trash.svg";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { AlertContext } from "../../../global/context/AlertContext";
import { SearchUsersContext } from "../context/SearchUsersContext";

const UsersTable = () => {
  const [user, setUser] = useState({});
  const { sort, users, setUsers, filteredUsers } =
    useContext(SearchUsersContext);
  const { months } = useContext(MonthsContext);
  const { setIsEditPersonSection } = useContext(CurrentSectionContext);
  const {
    setShowWarning,
    setWarning,
    warningOk,
    setWarningOk,
    setAlert,
    setShowAlert,
  } = useContext(AlertContext);

  let history = useHistory();

  // const changePersonStatus = async () => {
  //   const { rfc } = user;
  //   const newActive = { active: !person.active };
  //   try {
  //     const response = await fetchData(
  //       "put",
  //       `/people/${rfc}?field=active`,
  //       newActive
  //     );
  //     setAlert({
  //       success: true,
  //       msg: ["Se ha cambiado correctamente el estado de la persona"],
  //       removeOnEnter: true,
  //     });
  //     setShowAlert(true);
  //     const newPeople = people.map((person) => {
  //       if (person.rfc === rfc) {
  //         return { ...person, active: !person.active };
  //       }
  //       return person;
  //     });
  //     setUsers(newPeople);
  //   } catch (err) {
  //     // Create Alert
  //     setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
  //     setShowAlert(true);
  //   }
  //   setWarningOk(false);
  // };

  // const changeStatusHandler = async (e, person) => {
  //   e.stopPropagation();
  //   setUser(person);
  //   let personNextStatus;
  //   if (person.active) personNextStatus = "Desactivar";
  //   else personNextStatus = "Activar";
  //   let personName = `${person.first_name}`;
  //   if (person.second_name) personName += ` ${person.second_name}`;
  //   personName += ` ${person.surname} ${person.second_surname}`;
  //   const msg = [
  //     `¿Estás seguro de que quieres ${personNextStatus} a ${personName}?`,
  //   ];
  //   const secondaryMsg = "Esto hará cambiar su estado";
  //   setWarning({ msg, secondaryMsg, class: "", type: "changePersonStatus" });
  //   setShowWarning(true);
  // };

  // const updateHandler = (e, rfc) => {
  //   e.stopPropagation();
  //   setIsEditPersonSection(true);
  //   history.push(`/people/${rfc}/update`);
  // };

  // const personSelectHandler = (rfc) => {
  //   history.push(`/people/${rfc}`);
  // };

  const sortUsers = () => {
    let sortedUsers = [];
    sortedUsers = [...users].sort(compareValues(sort));
    setUsers(sortedUsers);
  };

  useEffect(() => {
    sortUsers();
  }, [sort]);

  // useEffect(() => {
  //   warningOk.changePersonStatus && changePersonStatus();
  // }, [warningOk]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <div className="flex-column">
              <span>Primer </span> <span>Nombre</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Segundo </span> <span>Nombre</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Primer </span> <span>Apellido</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Segundo </span> <span>Apellido</span>
            </div>
          </th>
          <th>Rol</th>
          <th>Email</th>
          {/* <th className="center-column">Email</th> */}
          {/* <th className="center-column">Area</th>
          <th className="center-column">
            <div className="flex-column">
              <span>Fecha</span> <span>de Alta</span>
            </div>
          </th>
          <th className="center-column">Estado</th> */}
          <th className="center-column">Editar</th>
          <th className="center-column">
            <div className="flex-column">
              <span>Activar </span> <span>Desactivar</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => {
          const {
            id,
            first_name,
            second_name,
            surname,
            second_surname,
            email,
            type,
          } = user;
          return (
            <tr
              key={id}
              className="person-row"
              // onClick={() => personSelectHandler(rfc)}
            >
              <td>{first_name}</td>
              <td>{second_name}</td>
              <td>{surname}</td>
              <td>{second_surname}</td>
              <td>{type}</td>
              <td>{email}</td>
              {/* <td className="center-column">
                <div className="flex-column">
                  {department_name ? (
                    department_name
                      .split(" ")
                      .map((name, index) => <span key={index}>{name}</span>)
                  ) : (
                    <>
                      <span>Sin</span>
                      <span>Asignar</span>
                    </>
                  )}
                </div>
              </td>
              <td className="center-column">{formattedDate}</td>
              <td>
                <div className="person-status">
                  {active ? (
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
              </td> */}
              <td>
                <div className="center-container">
                  <button
                    className="table-btn edit-btn"
                    onClick={() => history.push(`/user/${id}/update`)}
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    // onClick={(e) => changeStatusHandler(e, { ...person })}
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

export default UsersTable;
