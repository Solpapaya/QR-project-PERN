import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { fetchData } from "../functions/fetchData";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Trash } from "../icons/trash.svg";

const EditDepartmentsTable = () => {
  const [departments, setDepartments] = useState([]);
  let history = useHistory();

  const getDepartments = async () => {
    const response = await fetchData("get", "/departments");
    setDepartments(response.data.departments);
  };

  const updateHandler = (e, id) => {
    e.stopPropagation();
    history.push(`/departments/${id}/update`);
  };

  const deleteHandler = async (id) => {
    try {
      await fetchData("delete", `/departments/${id}`);
      const newDepartments = departments.filter((tax) => {
        return tax.id !== id;
      });
      setDepartments(newDepartments);

      // Tell user that the receipt was successfully deleted
    } catch (err) {
      // Alert that tells the user that the tax receipt could not be deleted
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Area</th>
          <th className="center-column">Editar</th>
          <th className="center-column">Borrar</th>
        </tr>
      </thead>
      <tbody>
        {departments.map((department) => {
          const { id, department_name } = department;
          return (
            <tr
              key={id}
              // className="person-row"
              // onClick={() => personSelectHandler(rfc)}
            >
              <td>{department_name}</td>
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
                    className="table-btn delete-btn"
                    onClick={() => deleteHandler(id)}
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

export default EditDepartmentsTable;
