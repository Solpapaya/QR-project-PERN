import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { fetchData } from "../../../global/functions/fetchData";

const DepartmentUpdate = () => {
  const idParams = useParams().id;

  const [department, setDepartment] = useState("");
  const [focus, setFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const ref = useRef(null);

  const getDepartment = async () => {
    try {
      const response = await fetchData("get", `/departments/${idParams}`);
      setDepartment(response.data.department_name);
    } catch (err) {
      console.log(err);
    }
  };

  const changeDepartment = (e) => {
    let value = e.target.value;
    // Prevent inserting only blank spaces
    value = value.trimStart();
    // Prevent inserting double blank spaces after any word
    if (value[value.length - 1] === " " && value[value.length - 2] === " ") {
      value = value.slice(0, -1);
    }
    // If the value is not Empty
    if (value) {
      const splitted = value.split(" ");
      // Convert to UpperCase the first letter of each word
      if (splitted.length > 1) {
        value = "";
        for (let i = 0; i < splitted.length; i++) {
          value +=
            " " + splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1);
        }
        value = value.trimStart();
      } else value = value.charAt(0).toUpperCase() + value.slice(1);
      // Tell that this input is not empty
      setIsEmpty(false);
    }
    setDepartment(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let trimDepartment = department.trim();
    // If there is a field empty, the field gets focused and tells the user to fill the field
    if (!trimDepartment) {
      setIsEmpty(true);
      setTimeout(() => {
        ref.current.focus();
      }, 100);
      return;
    }
    // Update Department
    try {
      const response = await fetchData("put", `/departments/${idParams}`, {
        department_name: trimDepartment,
      });
      // Show message that informs the user the person has been updated successfully
    } catch (error) {
      // Show alert the person couldn't have been updated
    }
    // history.push("/");
  };

  useEffect(() => {
    getDepartment();
  }, []);
  return (
    <>
      <h2>Actualizar Area</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div
          className={
            focus
              ? isEmpty
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={department ? "" : "hide"}>Area</span>
          <input
            type="text"
            value={department}
            ref={ref}
            onChange={changeDepartment}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </div>
        <button type="submit" className="add-btn">
          Agregar
        </button>
      </form>
    </>
  );
};

export default DepartmentUpdate;
