import React, { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

const Warning = (props) => {
  const { setWarningOk, setShowWarning, warning } = useContext(AlertContext);

  return (
    <div className="warning-container">
      <div className="warning__background"></div>
      <div className="warning">
        <div className="warning__icon">
          <svg
            version="1.1"
            class="warning__svg"
            x="0px"
            y="0px"
            viewBox="0 0 301.691 301.691"
          >
            <g>
              <polygon points="119.151,0 129.6,218.406 172.06,218.406 182.54,0  "></polygon>
              <rect
                x="130.563"
                y="261.168"
                width="40.525"
                height="40.523"
              ></rect>
            </g>
          </svg>
        </div>
        <div className="warning__content">
          <p className="warning__type">{warning}</p>
          {/* <p className="warning__type">
          ¿Estás seguro que deseas desactivar a esta persona?
        </p> */}
          <p className="warning__message">Esto hará cambiar su estado</p>
          {/* <p className="toast__message">{props.msg}</p> */}
        </div>
        <div className="warning__buttons">
          <button
            className="ok-btn warning-btn"
            onClick={() => {
              setWarningOk(true);
              setShowWarning(false);
            }}
          >
            Si
          </button>
          <button
            className="cancel-btn warning-btn"
            onClick={() => setShowWarning(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
