import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { AlertContext } from "../../../global/context/AlertContext";
import { AuthContext } from "../../../global/context/AuthContext";

const Sidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { currentSection, setCurrentSection } = useContext(
    CurrentSectionContext
  );
  let history = useHistory();

  const { setShowWarning, setWarning, warningOk, setWarningOk } =
    useContext(AlertContext);

  const logOutHandler = () => {
    const msg = [`¿Estás seguro de que quieres cerrar tu sesión?`];
    const secondaryMsg = "";
    setWarning({ msg, secondaryMsg, class: "", type: "logOut" });
    setShowWarning(true);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUser({ ...user, isAuth: false });
    setWarningOk({ ...warningOk, logOut: false });
  };

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
      case 5:
        history.push("/deleted");
        break;
    }
  };

  useEffect(() => {
    warningOk.logOut && logOut();
  }, [warningOk]);

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
            : currentSection === 5
            ? "sidebar-item-container right-bottom-border"
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
          <span className="btn-text">Áreas</span>
        </button>
      </div>
      <div
        className={
          currentSection === 5
            ? "sidebar-item-container selected"
            : currentSection === 4
            ? "sidebar-item-container right-top-border"
            : "sidebar-item-container right-border"
        }
      >
        <button
          onClick={clickHandler}
          className="sidebar-item"
          data-section="5"
        >
          <i class="fas fa-trash-alt sidebar-item-icon"></i>
          {/* <i className="sidebar-item-icon">
            <Department />
          </i> */}
          <span className="btn-text">Eliminados</span>
        </button>
      </div>
      <span
        className={
          currentSection === 5
            ? "sidebar-item-container right-top-border"
            : "right-border"
        }
      ></span>

      <div className="sidebar-item-container right-border">
        <button onClick={() => logOutHandler()} className="sidebar-item">
          <i class="fas fa-power-off sidebar-item-icon"></i>
          <span className="btn-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
