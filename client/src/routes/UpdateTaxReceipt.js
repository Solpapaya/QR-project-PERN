import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../functions/fetchData";
import { MonthsContext } from "../context/MonthsContext";
import { ReactComponent as Upload } from "../icons/uploadTax.svg";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { AlertContext } from "../context/AlertContext";
import { LoadingContext } from "../context/LoadingContext";

const UpdateTaxReceipt = () => {
  const idParam = useParams().id;
  const { months } = useContext(MonthsContext);
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const [isOver, setIsOver] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const { setAlert, setShowAlert } = useContext(AlertContext);
  const { setShowLoading } = useContext(LoadingContext);

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
        // Show Loading Animation
        setShowLoading(true);
        const response = await fetchData(
          "put",
          `/taxreceipts/${idParam}`,
          formData,
          true
        );
        // Hide Loading Animation
        setShowLoading(false);
        const { year, month, full_name, rfc } = response.data;
        setAlert({
          success: true,
          msg: [
            `Se ha modificado correctamente el Comprobante de ${full_name}.`,
            `Antes: ${tax.year} - ${months[tax.month - 1]}`,
            `Ahora: ${year} - ${months[month - 1]}`,
          ],
          // msg: `El comprobante de ${full_name} para el Año: '${year}' y Mes: '${
          //   months[month - 1]
          // }' se ha agregado correctamente`,
          removeOnEnter: false,
        });
        setShowAlert(true);
        setTax({ year, month, full_name, rfc });
      } catch (err) {
        // Hide Loading Animation
        setShowLoading(false);
        // Show Alert
        setAlert({ success: false, msg: err.data.msg, removeOnEnter: false });
        setShowAlert(true);
      }
    } else {
      // Alert the user the file is not in PDF format
      setAlert({ success: false, msg: [errorInfo], removeOnEnter: false });
      setShowAlert(true);
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

  const [tax, setTax] = useState({
    year: "",
    month: "",
    full_name: "",
    rfc: "",
  });

  const getTax = async () => {
    const response = await fetchData("get", `/taxreceipts/${idParam}`);
    setTax(response.tax_receipt);
  };

  useEffect(() => {
    setCurrentSection(2);
    getTax();
    document.body.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    document.body.addEventListener("drop", function (e) {
      e.preventDefault();
    });
  }, []);

  return (
    <div
      className={
        highlight ? "update-tax-container highlight" : "update-tax-container"
      }
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
    >
      <div className="tax-info-container">
        <div className="tax-info">
          <span>Nombre</span>
          <div>{tax.full_name}</div>
        </div>
        <div className="tax-info">
          <span>RFC</span>
          <div id="tax-rfc">{tax.rfc}</div>
        </div>
        <div className="tax-info">
          <span>Año</span>
          <div>{tax.year}</div>
        </div>
        <div className="tax-info">
          <span>Mes</span>
          <div>{months[tax.month - 1]}</div>
        </div>
      </div>

      <div className="upload-tax-area update">
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
    </div>
  );
};

export default UpdateTaxReceipt;
