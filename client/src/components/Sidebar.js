import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { ReactComponent as QR } from "../icons/qr.svg";
import { ReactComponent as Search } from "../icons/search.svg";
import { ReactComponent as UploadFile } from "../icons/uploadFile.svg";
import { ReactComponent as Department } from "../icons/department.svg";

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
        history.push("/taxreceipt");
        break;
      case 3:
        history.push("/create/people");
        break;
      case 4:
        history.push("/departments");
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
          {/* <QR /> */}
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
          {/* <i className="sidebar-item-icon">
            <Search />
          </i> */}
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
          {/* <i className="sidebar-item-icon">
            <UploadFile />
          </i> */}
          <span className="btn-text">Subir Archivo</span>
        </button>
      </div>
      <div
        className={
          currentSection === 3
            ? "sidebar-item-container selected"
            : currentSection === 2
            ? "sidebar-item-container right-top-border"
            : currentSection === 4
            ? "sidebar-item-container right-bottom-border"
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
      <div
        className={
          currentSection === 4
            ? "sidebar-item-container selected"
            : currentSection === 3
            ? "sidebar-item-container right-top-border"
            : "sidebar-item-container right-border"
        }
      >
        <button
          onClick={clickHandler}
          className="sidebar-item"
          data-section="4"
        >
          <i className="fas fa-building sidebar-item-icon"></i>
          {/* <i className="sidebar-item-icon">
            <Department />
          </i> */}
          <span className="btn-text">Areas</span>
        </button>
      </div>
      <span
        className={
          currentSection === 4
            ? "sidebar-item-container right-top-border"
            : "right-border"
        }
      ></span>
    </aside>
  );
};

export default Sidebar;
