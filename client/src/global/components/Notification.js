import React, { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

const Notification = (props) => {
  const { alert, setShowAlert } = useContext(AlertContext);

  return (
    <div className={props.success ? "toast toast--green" : "toast toast--red"}>
      <div className="toast__icon">
        {props.success ? (
          <svg
            version="1.1"
            className="toast__svg"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
          >
            <g>
              <g>
                <path d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0    c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7    C514.5,101.703,514.499,85.494,504.502,75.496z"></path>
              </g>
            </g>
          </svg>
        ) : (
          <svg
            version="1.1"
            className="toast__svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15.642 15.642"
          >
            <path
              fill-rule="evenodd"
              d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"
            ></path>
          </svg>
        )}
      </div>
      <div className="toast__content">
        <p className="toast__type">{props.header}</p>
        <div className="toast__message">
          {alert.msg.map((msg) => {
            return (
              <>
                {Array.isArray(msg) ? (
                  <div>
                    <span className="toast__message--primary">{msg[0]}</span>
                    <span>{msg[1]}</span>
                  </div>
                ) : (
                  <span>{msg}</span>
                )}
              </>
            );
            return <span>{msg}</span>;
          })}
        </div>
      </div>
      <div className="toast__close" onClick={() => setShowAlert(false)}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 15.642 15.642"
        >
          <path
            fill-rule="evenodd"
            d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Notification;
