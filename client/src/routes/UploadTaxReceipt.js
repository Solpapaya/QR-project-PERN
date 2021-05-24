import React, { useContext, useEffect, useState } from "react";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { fetchData } from "../functions/fetchData";
import { ReactComponent as Upload } from "../icons/uploadTax.svg";

const UploadTaxReceipt = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const [isOver, setIsOver] = useState(false);
  const [highlight, setHighlight] = useState(false);

  function validateFile(files) {
    if (files.length > 1)
      return { boolean: false, errorInfo: "Subir 1 archivo a la vez" };
    if (files[0].type === "application/pdf") {
      return { boolean: true };
    } else {
      return { boolean: false, errorInfo: "El formato debe ser PDF" };
    }
  }

  const uploadTax = async (e) => {
    let files;
    // If the tax was uploaded with the input of type 'file'
    if (e.target.files) {
      files = e.target.files;
      if (files.length < 1) return;
    } else {
      // Takes the files that have been dropped
      const dt = e.dataTransfer;
      files = dt.files;
    }
    const { boolean, errorInfo } = validateFile(files);

    if (boolean) {
      // Decode the QR code and retrieve the Date from the PDF Tax Receipt
      const formData = new FormData();
      formData.append("file", files[0]);
      try {
        const response = await fetchData("post", "/taxreceipt", formData, true);
        console.log({ response });
      } catch (err) {
        console.log(err.data.msg);
      }
    } else {
      // Alert the user the file is not in PDF format
      console.log({ errorInfo });
      // showErrorAlert(errorInfo);
    }
  };

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
    uploadTax(e);
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
        <label className="add-btn" for="myfile">
          Selecciona Archivo
        </label>
        <input
          type="file"
          id="myfile"
          name="myfile"
          accept="application/pdf"
          onChange={uploadTax}
        ></input>
      </div>
    </div>
  );
};

export default UploadTaxReceipt;
