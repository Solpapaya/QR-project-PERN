import React, { useContext, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { AlertContext } from "../context/AlertContext";
import { ReactComponent as ArrowIcon } from "../icons/arrow.svg";

const Warning = () => {
  const { setWarningOk, setShowWarning, warning, setWarning, warningOk } =
    useContext(AlertContext);

  const txtAreaRef = useRef(null);
  return (
    <div className="warning-container">
      <div className="warning__background"></div>
      {warning.type === "deleteTaxReceipt" ? (
        <div className={`warning ${warning.class}`}>
          <CSSTransition
            in={warning.activeMenu === "areYouSure"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
          >
            <div className="warning__menu">
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
                    setWarning({ ...warning, activeMenu: "deleteMsg" });
                  }}
                >
                  Si
                </button>
                <button
                  className="cancel-btn warning-btn"
                  onClick={() => {
                    setWarningOk({ ...warningOk, [warning.type]: false });
                    setShowWarning(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </CSSTransition>

          <CSSTransition
            in={warning.activeMenu === "deleteMsg"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
          >
            <div className="warning__menu">
              <div
                className="warning__menu__return"
                onClick={() =>
                  setWarning({ ...warning, activeMenu: "areYouSure" })
                }
              >
                <ArrowIcon />
              </div>
              <div className="warning__content">
                <div className="warning__type">
                  Ingresa el motivo por el cual quieres borrar este comprobante
                  fiscal
                </div>
              </div>
              <div className="warning__txtArea">
                <textarea
                  id="w3review"
                  name="w3review"
                  placeholder="Escribe tu mensaje"
                  ref={txtAreaRef}
                ></textarea>
              </div>
              <div className="warning__buttons">
                <button
                  className="ok-btn warning-btn"
                  onClick={() => {
                    setWarning({
                      ...warning,
                      whyTaxDeleted: txtAreaRef.current.value,
                    });
                    setWarningOk({ ...warningOk, [warning.type]: true });
                    setShowWarning(false);
                  }}
                >
                  Borrar
                </button>
                <button
                  className="cancel-btn warning-btn"
                  onClick={() => {
                    setWarningOk({ ...warningOk, [warning.type]: false });
                    setShowWarning(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </CSSTransition>
        </div>
      ) : (
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
                setWarningOk({ ...warningOk, [warning.type]: true });
                setShowWarning(false);
              }}
            >
              Si
            </button>
            <button
              className="cancel-btn warning-btn"
              onClick={() => {
                setWarningOk({ ...warningOk, [warning.type]: false });
                setShowWarning(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warning;
