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
    }
  };

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
    </aside>
  );
};

export default Sidebar;
