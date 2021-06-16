import React, { useRef, useState, useEffect } from "react";
import { fetchData } from "../functions/fetchData";
import Notification from "./Notification";
import { CSSTransition } from "react-transition-group";

const AddDepartment = () => {
  const [focus, setFocus] = useState(false);
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const ref = useRef(null);

  const [department, setDepartment] = useState("");

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
    // Add Department
    try {
      const response = await fetchData("post", "/departments", {
        department_name: trimDepartment,
      });
      // Show message that informs the department has been added successfully
      setResponse({
        success: true,
        msg: "Se ha agregado correctamente la nueva área",
      });
      setDepartment("");
    } catch (err) {
      // Show alert the person couldn't have been updated
      setResponse({ success: false, msg: err.data.msg });
    }
    setShowAlert(true);
    setFocus(true);
    ref.current.focus();
    // history.push("/");
  };

  useEffect(() => {
    ref.current.focus();
  }, []);

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
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
      <button type="submit" className="add-btn update">
        Agregar
      </button>

      <CSSTransition
        in={showAlert}
        timeout={300}
        classNames="alert"
        unmountOnExit
        onEnter={() => removeNotification()}
      >
        {response.success ? (
          <Notification
            header="Operación Exitosa"
            msg={response.msg}
            success={true}
            setShowAlert={setShowAlert}
          />
        ) : (
          <Notification
            header="Error"
            msg={response.msg}
            success={false}
            setShowAlert={setShowAlert}
          />
        )}
      </CSSTransition>
    </form>
  );
};

export default AddDepartment;
