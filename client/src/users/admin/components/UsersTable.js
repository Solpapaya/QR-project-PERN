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

  const deleteUser = async () => {
    const { id } = user;
    try {
      const headers = { token: localStorage.token };
      const response = await fetchData("delete", `/users/${id}`, {
        headers,
      });
      const { user_full_name, email, type } = response.data;
      setAlert({
        success: true,
        msg: [
          "El usuario se ha borrado correctamente",
          [`Nombre:`, ` ${user_full_name}`],
          [`Email:`, ` ${email}`],
          [`Tipo:`, ` ${type}`],
        ],
        removeOnEnter: false,
      });
      setShowAlert(true);

      const newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
    } catch (err) {
      // Create Alert
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
      setShowAlert(true);
    }
    setWarningOk(false);
  };

  const deleteHandler = async (user) => {
    setUser(user);
    const { first_name, second_name, surname, second_surname, email, type } =
      user;
    let personName = `${first_name}`;
    if (second_name) personName += ` ${second_name}`;
    personName += ` ${surname} ${second_surname}`;
    const msg = [
      `¿Estás seguro de que quieres eliminar este usuario?`,
      [`Nombre:`, ` ${personName}`],
      [`Email:`, ` ${email}`],
      [`Tipo:`, ` ${type}`],
    ];
    const secondaryMsg = "El usuario ya no se podrá recuperar";
    setWarning({
      msg,
      secondaryMsg,
      class: "warning--delete warning--deleteTaxReceipt",
      type: "changePersonStatus",
    });
    setShowWarning(true);
  };

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

  const updateHandler = (e, id) => {
    e.stopPropagation();
    setIsEditPersonSection(true);
    history.push(`/user/${id}/update`);
  };

  useEffect(() => {
    sortUsers();
  }, [sort]);

  useEffect(() => {
    warningOk.changePersonStatus && deleteUser();
  }, [warningOk]);

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
          {/* <th>Rol</th> */}
          <th>
            <div className="flex-column">
              <span>Tipo de</span> <span>Usuario</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Fecha</span> <span>de Alta</span>
            </div>
          </th>
          <th>Email</th>
          <th className="center-column">Editar</th>
          <th className="center-column">Borrar</th>
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
            creation_date,
            creation_time,
          } = user;
          const userCreatedSplittedDate = creation_date.split("/");
          const userCreatedFormattedDate = `${
            months[parseInt(userCreatedSplittedDate[1]) - 1]
          } ${userCreatedSplittedDate[0]}, ${userCreatedSplittedDate[2]}`;
          return (
            <tr key={id} className="user-row">
              <td>{first_name}</td>
              <td>{second_name}</td>
              <td>{surname}</td>
              <td>{second_surname}</td>
              <td>{type}</td>
              <td>
                <div className="flex-column">
                  <span>{userCreatedFormattedDate}</span>
                  <span className="second-value">{creation_time}</span>
                </div>
              </td>
              <td>{email}</td>
              <td>
                <div className="center-container">
                  <button
                    className="table-btn edit-btn"
                    onClick={(e) => updateHandler(e, id)}
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    onClick={(e) => deleteHandler(user)}
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
