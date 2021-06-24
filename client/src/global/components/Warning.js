import React, { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

const Warning = (props) => {
  const { setWarningOk, setShowWarning, warning } = useContext(AlertContext);

  return (
    <div className="warning-container">
      <div className="warning__background"></div>
      <div className={`warning ${warning.class}`}>
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
          <div className="warning__type">
            {warning.msg.map((msg) => {
              return <span>{msg}</span>;
            })}
          </div>
          <p className="warning__message">{warning.secondaryMsg}</p>
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
            onClick={() => {
              setWarningOk(false);
              setShowWarning(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
