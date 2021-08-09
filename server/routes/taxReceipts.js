const router = require("express").Router();
const path = require("path");
const fs = require("fs");

// Module for parsing incoming HTML form data. (Getting submitted file)
const Busboy = require("busboy");
// Module for executing python script on the server
const { spawn } = require("child_process");

// Connection to Database
const db = require("../db/index");

// Month Array for convertion
const { months } = require("../consts/variables");
// Path for saving submitted file
const { tmpDirectory } = require("../consts/variables");

// --------------------------------IMPORTING MIDDLEWARE--------------------------------
const { authUser, getRole } = require("../middleware/authorization");

router.get("/", async (req, res) => {
  const { get } = req.query;
  try {
    if (get === "years") {
      const results = await db.query(
        `SELECT DISTINCT EXTRACT(YEAR FROM date) as years FROM tax_receipt ORDER BY EXTRACT(YEAR FROM date) DESC `,
        []
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No tax receipts`,
        });
      }
      res.status(200).json({
        success: true,
        length: results.rows.length,
        data: {
          tax_receipts_years: results.rows,
        },
      });
    } else {
      const results = await db.query(
        `SELECT tax_receipt.id, EXTRACT(YEAR FROM tax_receipt.date) as year, 
            EXTRACT(MONTH FROM tax_receipt.date) as month,
            person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
            || person.surname || ' ' || person.second_surname as full_name, person.rfc
            FROM person INNER JOIN tax_receipt
            ON person.rfc = tax_receipt.rfc_emitter
            ORDER BY tax_receipt.date DESC`,
        []
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No tax receipts`,
        });
      }
      res.status(200).json({
        success: true,
        length: results.rows.length,
        data: {
          tax_receipts: results.rows,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting Tax Receipts" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.query(
      `SELECT EXTRACT(YEAR FROM tax_receipt.date) as year, 
          EXTRACT(MONTH FROM tax_receipt.date) as month,
          person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
          || person.surname || ' ' || person.second_surname as full_name, person.rfc
          FROM person INNER JOIN tax_receipt
          ON person.rfc = tax_receipt.rfc_emitter
          WHERE tax_receipt.id = $1`,
      [id]
    );
    if (results.rowCount === 0) {
      return res.status(404).json({
        success: false,
        msg: `No tax receipt with ID ${id}`,
      });
    }
    res.status(200).json({
      success: true,
      tax_receipt: results.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting Person" });
  }
});

// POST request when user wants to upload a PDF Tax Receipt
router.post("/", async (req, res) => {
  try {
    // Decode QR code & get date from PDF Tax Receipt
    const decodedData = await decodePDFTaxReceipt(req);

    // Get the RFC and Date from the python script response
    const data = formatData(decodedData);

    // Create new Tax Receipt register in the Database
    const newTaxReceipt = await createTaxReceipt(data);

    // // Insertion was successful
    res.status(200).json({ success: true, data: newTaxReceipt });
  } catch (err) {
    return res.status(err.status).json({ success: false, msg: err.msg });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Get the RFC and Date of the tax receipt that wants to be updated
    const currentData = await getDataFromCurrentTax(id);

    const { month, year, rfc, full_name } = currentData;

    // Decode QR code & get date from the new PDF Tax Receipt
    const decodedData = await decodePDFTaxReceipt(req);

    // Get the RFC and Date from the python script response
    const newData = formatData(decodedData);

    if (newData.rfc !== rfc)
      return res.status(400).json({
        success: false,
        msg: [`El comprobante que deseas subir no pertenece a '${full_name}'`],
        // msg: `The tax receipt you want to upload is not from the same person you want to modify it from`,
      });

    const splittedDate = splitDate(newData.date);
    if (splittedDate.year === year && splittedDate.month === month) {
      return res.status(403).json({
        success: false,
        msg: [`El Comprobante que deseas subir es el mismo que el actual`],
        // msg: `The tax receipt you want to update with is the same as the current one`,
      });
    }

    // Check if the new tax receipt already exists in the database
    await checkTaxAlreadyExists(
      splittedDate.year,
      splittedDate.month,
      newData.rfc,
      full_name
    );

    // Updates the tax receipt
    const results = await updateTaxReceipt(
      `${splittedDate.year}-${splittedDate.month}-01`,
      id
    );

    res.status(200).json({
      success: true,
      data: {
        full_name,
        rfc: newData.rfc,
        year: splittedDate.year,
        month: splittedDate.month,
      },
    });
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ success: false, msg: err.msg });
    } else {
      res
        .status(500)
        .json({ success: false, msg: ["Error al Actualizar el Comprobante"] });
      // .json({ success: false, msg: ["Error Updating Tax Receipt"] });
    }
  }
});

router.delete("/:id", authUser, getRole, async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { why_tax_deleted } = req.body;
    const taxReceiptID = req.params.id;
    let results = await db.query(
      `DELETE FROM tax_receipt WHERE id = $1
          RETURNING
          EXTRACT(YEAR FROM tax_receipt.date) as year,
          EXTRACT(MONTH FROM tax_receipt.date) as month,
          EXTRACT(DAY FROM tax_receipt.date) as day,
          rfc_emitter`,
      [taxReceiptID]
    );
    if (results.rowCount === 0) {
      return res.status(404).json({
        success: false,
        msg: "No existe el Comprobante Fiscal que deseas eliminar",
      });
    }

    const { year, month, day, rfc_emitter } = results.rows[0];
    const taxReceiptDate = `${year}-${month}-${day}`;

    results = await db.query(
      `WITH inserted AS (
        INSERT INTO deleted_tax_receipts 
        (tax_receipt_date, tax_receipt_emitter, deleted_by, why_was_deleted) VALUES 
        ($1, $2, $3, $4) 
        RETURNING *
      )
      SELECT person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
      || person.surname || ' ' || person.second_surname as full_name
      FROM inserted
      INNER JOIN person 
      ON inserted.tax_receipt_emitter = person.rfc;`,
      [taxReceiptDate, rfc_emitter, userId, why_tax_deleted]
    );
    res.status(200).json({
      success: true,
      data: {
        full_name: results.rows[0].full_name,
        year,
        month,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "No se pudo borrar el Comprobante" });
    // res.status(500).json({ success: false, msg: "Error Deleting Tax Receipt" });
  }
});

// --------------------------------FUNCTIONS--------------------------------
const checkTaxAlreadyExists = (year, month, rfc, full_name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db.query(
        `SELECT * FROM tax_receipt
                WHERE rfc_emitter = $1 
                AND EXTRACT(MONTH FROM date) = $2
                AND EXTRACT(YEAR FROM date) = $3`,
        [rfc, month, year]
      );
      if (result.rows.length > 0) {
        reject({
          status: 409,
          msg: [
            "Ya existe este comprobante",
            `De: ${full_name}`,
            `Año: ${year}`,
            `Mes: ${months[month - 1]}`,
          ],
          // msg: `Ya existe un Comprobante con el Mes: '${
          //   months[month - 1]
          // }' y Año: '${year}'`,
          // msg: `Error, There is already a Tax Receipt with the Month: ${
          //   months[month - 1]
          // } and Year: ${year}`,
        });
      } else {
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
};

const updateTaxReceipt = (date, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let results = await db.query(
        `UPDATE tax_receipt 
          SET date = $1
          WHERE id = $2 RETURNING *`,
        [date, id]
      );

      resolve(results.rows[0]);
    } catch (err) {
      reject(err);
    }
  });
};

const splitDate = (date) => {
  const year = parseInt(date.split("-")[0]);
  const month = parseInt(date.split("-")[1]);
  return { year, month };
};

const getDataFromCurrentTax = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await db.query(
        `SELECT EXTRACT(YEAR FROM tax_receipt.date) as year, 
            EXTRACT(MONTH FROM tax_receipt.date) as month,
            person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
            || person.surname || ' ' || person.second_surname as full_name, person.rfc
            FROM person INNER JOIN tax_receipt
            ON person.rfc = tax_receipt.rfc_emitter
            WHERE tax_receipt.id = $1`,
        [id]
      );
      if (results.rowCount === 0)
        reject({ status: 404, msg: `Tax Receipt with ID ${id} doesn't exist` });
      else resolve(results.rows[0]);
    } catch (err) {
      reject(err);
    }
  });
};

const createTaxReceipt = (data) => {
  return new Promise(async (resolve, reject) => {
    const { rfc, date } = data;
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const result = await db.query(
      `SELECT * FROM tax_receipt
              WHERE rfc_emitter = $1 
              AND EXTRACT(MONTH FROM date) = $2
              AND EXTRACT(YEAR FROM date) = $3`,
      [rfc, month, year]
    );

    // If the Tax Receipt that has been uploaded already exists sends an error
    // message indicating the full name of the tax receipt owner and tax receipt month
    if (result.rowCount !== 0) {
      const person = await db.query(
        `SELECT first_name || ' ' || COALESCE(second_name || ' ', '') 
                  || surname || ' ' || second_surname AS full_name
                  FROM person 
                  WHERE rfc = $1`,
        [rfc]
      );
      const fullName = person.rows[0]["full_name"];
      reject({
        status: 409,
        msg: [
          "Ya existe este comprobante",
          `De: ${fullName}`,
          `Año: ${year}`,
          `Mes: ${months[month - 1]}`,
        ],
        // msg: `El comprobante de ${fullName} para el Año: '${year}' y Mes: '${
        //   months[month - 1]
        // }' YA EXISTE`,
      });
    } else {
      // If Tax Receipt doesn't exist, create a new register in the Tax Receipt table
      try {
        newTaxReceipt = await db.query(
          `WITH inserted AS (
              INSERT INTO tax_receipt 
              (date, rfc_emitter) VALUES 
              ($1, $2) 
              RETURNING *
            )
            SELECT EXTRACT(YEAR FROM inserted.date) as year, 
            EXTRACT(MONTH FROM inserted.date) as month,
            person.first_name || ' ' || 
            COALESCE(person.second_name || ' ', '') || 
            person.surname || ' ' || 
            person.second_surname as full_name, person.rfc
            FROM inserted
            INNER JOIN person 
            ON inserted.rfc_emitter = person.rfc`,
          [date, rfc]
        );
        resolve(newTaxReceipt.rows[0]);
      } catch (err) {
        reject({ status: 500, msg: "Error Inserting into Database" });
      }
    }
  });
};

const decodePDFTaxReceipt = (req) => {
  return new Promise((resolve, reject) => {
    let dataFromPythonScript = [];
    let tmpFile;
    const busboy = new Busboy({ headers: req.headers });
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      tmpFile = path.join(tmpDirectory, filename);
      busboy.tmpPath = path.join(tmpDirectory, filename);
      // Receives chunk of data, when it receives a chunk of data it is stored in a
      // new file inside the 'tmp' directory. The new file name is the same as the
      // uploaded file name
      file.on("data", (data) => {
        fs.writeFileSync(busboy.tmpPath, data, { flag: "a" });
      });
    });
    // When all the file has been uploaded
    busboy.on("finish", () => {
      // console.log("Done parsing form!, Calling Python Script...");
      // Calls python script for decoding the QR Code that is inside the
      // PDF Tax Receipt recently uploaded

      // Command for Windows
      // const process = spawn("py", [
      //   path.resolve(__dirname, "py", "readQR.py"),
      //   // path.resolve(__dirname, "python3", "readQR.py"),
      //   busboy.tmpPath,
      // ]);

      // Command for Mac
      const dirname = path.dirname(__dirname);
      const process = spawn("python3", [
        path.resolve(dirname, "py", "readQR.py"),
        busboy.tmpPath,
      ]);
      // Receives what 'print' operations print in the python script
      process.stdout.on("data", (data) => {
        dataFromPythonScript.push(data.toString());
      });
      // When Python Script ends
      process.on("close", (code) => {
        dataFromPythonScript = dataFromPythonScript[0].split("\n");
        if (dataFromPythonScript.includes("Python Script Error")) {
          reject({ status: 500, msg: ["No se pudo leer el Código QR"] });
          try {
            fs.unlinkSync(tmpFile);
            //file removed
          } catch (err) {
            console.log(err);
          }
        } else resolve(dataFromPythonScript);
      });
    });
    req.pipe(busboy);
  });
};

const formatData = (dataFromPythonScript) => {
  // Remove blank spaces from the start and end of the string
  const startRFC = dataFromPythonScript[0].search("&re=");
  const endRFC = dataFromPythonScript[0].search("&rr=");
  const rfc = dataFromPythonScript[0].substring(startRFC + 4, endRFC);

  const date = dataFromPythonScript[1];

  return { rfc, date };
};

module.exports = router;
