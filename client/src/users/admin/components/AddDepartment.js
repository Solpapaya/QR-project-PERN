import React, { useRef, useState, useEffect, useContext } from "react";
import { fetchData } from "../../../global/functions/fetchData";
// import { fetchData } from "../functions/fetchData";
import { AlertContext } from "../../../global/context/AlertContext";
// import { AlertContext } from "../../../context/AlertContext";

const AddDepartment = () => {
  const [focus, setFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const ref = useRef(null);

  const [department, setDepartment] = useState("");

  const [departmentAlreadyExists, setDepartmentAlreadyExists] = useState(false);
  const { setAlert, setShowAlert } = useContext(AlertContext);

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
      setDepartmentAlreadyExists(false);
      setIsEmpty(true);
      setTimeout(() => {
        ref.current.focus();
      }, 100);
      return;
    }
    // Add Department
    try {
      const response = await fetchData("post", "/departments", {
        department_name: trimDepartment,
      });
      // Show message that informs the department has been added successfully
      setDepartmentAlreadyExists(false);
      setAlert({
        success: true,
        msg: ["Se ha agregado correctamente la nueva área"],
        removeOnEnter: true,
      });
      setDepartment("");
    } catch (err) {
      // Show alert the person couldn't have been updated
      setIsEmpty(true);
      setDepartmentAlreadyExists(true);
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
    }
    setShowAlert(true);
    setFocus(true);
    ref.current.focus();
  };

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div
        className={
          focus
            ? isEmpty
              ? departmentAlreadyExists
                ? "add-input-container selected duplicated-department"
                : "add-input-container selected empty"
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
      <button type="submit" className="add-btn update">
        Agregar
      </button>
    </form>
  );
};

export default AddDepartment;
