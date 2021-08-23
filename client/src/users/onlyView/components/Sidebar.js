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
    localStorage.removeItem("searchSubsection");
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
    }
  };

  useEffect(() => {
    warningOk.logOut && logOut();
  }, [warningOk]);

  return (
    <aside className="sidebar sidebar-user">
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
      <span
        className={
          currentSection === 1
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
