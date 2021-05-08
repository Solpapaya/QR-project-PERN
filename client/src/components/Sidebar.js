import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { CurrentSectionContext } from "../context/CurrentSectionContext";

const Sidebar = () => {
  const { currentSection, setCurrentSection } = useContext(
    CurrentSectionContext
  );
  let history = useHistory();

  const clickHandler = (e) => {
    const newSection = parseInt(e.currentTarget.dataset.section);

    setCurrentSection(newSection);
    switch (newSection) {
      case 1:
        history.push("/");
        break;
      case 2:
        break;
      case 3:
        history.push("/create/people");
        break;
    }
  };

  return (
    <aside className="sidebar">
      <div
        className={
          currentSection === 1
            ? "logo-container right-bottom-border"
            : "logo-container right-border"
        }
      >
        <button onClick={clickHandler} className="logo" data-section="1">
          <i className="fas fa-qrcode"></i>
        </button>
      </div>
      <div
        className={
          currentSection === 1
            ? "sidebar-item-container selected"
            : currentSection === 2
            ? "sidebar-item-container right-bottom-border"
            : "sidebar-item-container right-border"
        }
      >
        <button
          onClick={clickHandler}
          className="sidebar-item"
          data-section="1"
        >
          <i className="fas fa-search sidebar-item-icon"></i>
          <span className="btn-text">Buscar</span>
        </button>
      </div>
      <div
        className={
          currentSection === 2
            ? "sidebar-item-container selected"
            : currentSection === 1
            ? "sidebar-item-container right-top-border"
            : currentSection === 3
            ? "sidebar-item-container right-bottom-border"
            : "sidebar-item-container right-border"
        }
      >
        <button
          onClick={clickHandler}
          className="sidebar-item"
          data-section="2"
        >
          <i className="fas fa-file-upload sidebar-item-icon"></i>
          <span className="btn-text">Subir Archivo</span>
        </button>
      </div>
      <div
        className={
          currentSection === 3
            ? "sidebar-item-container selected"
            : currentSection === 2
            ? "sidebar-item-container right-top-border"
            : "sidebar-item-container right-border"
        }
      >
        <button
          onClick={clickHandler}
          className="sidebar-item"
          data-section="3"
        >
          <i className="fas fa-user-plus sidebar-item-icon"></i>
          <span className="btn-text">Agregar Persona</span>
        </button>
      </div>
      <span
        className={
          currentSection === 3
            ? "sidebar-item-container right-top-border"
            : "right-border"
        }
      ></span>
    </aside>
  );
};

export default Sidebar;
