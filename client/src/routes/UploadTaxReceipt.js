import React, { useContext, useEffect, useState } from "react";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { ReactComponent as Upload } from "../icons/uploadTax.svg";

const UploadTaxReceipt = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const [isOver, setIsOver] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const dragOverHandler = (e) => {
    // Stopping default prevents opening a new browser tab for showing the
    // file that has been dropped
    e.preventDefault();
    setIsOver(true);
    setHighlight(true);
  };

  const dragLeaveHandler = () => {
    setIsOver(false);
    /* Waits 10ms for checking whether the mouse is over the dropArea or not
        Because if you move into a child of the 'upload-container' DIV it will
        count as if you have left the dropArea and eventually it will
        produce a 'dragleave' event even though you are still moving inside the
        dropArea. So that's why it waits 10ms because if the mouse is still moving
        inside the dropArea, it will create a 'dragover' 7ms or less after the dragleave
        event was fired. And that's how we know whether the mouse has left the dropArea
        or not */
    setTimeout(() => {
      // prevState give us the last Update of setIsOver
      // (the one that is located in this same function => 'setIsOver(false)'),
      //if we don't use it it will always return true
      setIsOver((prevState) => {
        if (!prevState) {
          setHighlight(false);
        }
        return prevState;
      });
    }, 10);
  };

  const dropHandler = (e) => {
    /* Stopping default prevents opening a new browser tab for showing the file that has been dropped
        Both are necessary, for 'drop' and 'dragover' events */
    e.preventDefault();
    setHighlight(false);
    //   handleDrop(e);
  };

  useEffect(() => {
    setCurrentSection(2);
    document.body.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    document.body.addEventListener("drop", function (e) {
      e.preventDefault();
    });
  }, []);

  return (
    <div
      //   className="upload-tax"
      className={highlight ? "upload-tax highlight" : "upload-tax"}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
    >
      <Upload />
      <h3>Arrastra aqui el Comprobante Fiscal</h3>
      <p>El archivo debe ser en formato PDF</p>
      <div className="select-file-container">
        <span>o</span>
        <button className="add-btn">Selecciona Archivo</button>
      </div>
    </div>
  );
};

export default UploadTaxReceipt;
