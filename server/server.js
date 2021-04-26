require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Module for parsing incoming HTML form data. (Getting submitted file)
const Busboy = require("busboy");
// Module for executing python script on the server
const { spawn } = require("child_process");

// Server Instance
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

// Connection to Database
const db = require("./db");

// Path for saving submitted file
const tmpDirectory = path.resolve(__dirname, "tmp");
// Month Array for convertion
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Serve static resources like index.html, styles, JavaScript logic
app.use(express.static(path.resolve(__dirname, "public")));
// Parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.put("/people/:rfc", async (req, res) => {
  try {
    const { firstName, secondName, surname, secondSurname, rfc } = req.body;
    const results = await db.query(
      `UPDATE persona SET primer_nombre = $1, segundo_nombre = $2,
        primer_apellido = $3, segundo_apellido = $4, rfc = $5 
        WHERE rfc = $6 RETURNING *`,
      [firstName, secondName, surname, secondSurname, rfc, req.params.rfc]
    );
    res.status(200).json({
      success: true,
      length: results.rows.length,
      data: {
        person: results.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Updating Person" });
  }
  //   res.send("hello");
  // try {

  // } catch (err) {
  //     res.status(500).json({success: false, msg: 'Error Updating Worker'})
  // }
});

app.post("/people", async (req, res) => {
  try {
    const { firstName, secondName, surname, secondSurname, rfc } = req.body;
    const results = await db.query(
      `INSERT INTO persona (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rfc) VALUES
    ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, secondName, surname, secondSurname, rfc]
    );
    res.status(200).json({
      success: true,
      length: results.rows.length,
      data: {
        person: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    if (err.code == 23505) {
      const { rfc } = req.body;
      return res
        .status(404)
        .json({ success: false, msg: `Person with RFC ${rfc} already exists` });
    }
    res.status(500).json({ success: false, msg: "Error Deleting Person" });
  }

  //   const { firstName, secondName, surname, secondSurname, rfc } = req.body;
  //   try {
  //     let query = `INSERT INTO persona (primer_nombre, segundo_nombre, primer_apellido,
  //             segundo_apellido, rfc) VALUES`;
  //     // If the second name is not NULL, the second name can be wrapped with single quotes
  //     // in order to tell the database that it is a String
  //     if (secondName) {
  //       query += ` ('${firstName}', '${secondName}', '${surname}', '${secondSurname}',
  //                      '${rfc}')`;
  //     }
  //     // If the second name is NULL, the second name doesn't has single quotes because we
  //     // want to send a NULL type to the Database. If we surround NULL with single quotes
  //     // PostgreSQL will treat NULL as a String. Therefore we would have:
  //     // Juan Null Campos Ruiz instead of Juan Campos Ruiz
  //     else {
  //       query += ` ('${firstName}', ${secondName}, '${surname}', '${secondSurname}',
  //                      '${rfc}')`;
  //     }
  //     query += ` RETURNING primer_nombre, segundo_nombre, primer_apellido,
  //         segundo_apellido, rfc`;
  //     const newWorker = await pool.query(query);
  //     // Returns the name and RFC of the new worker inserted
  //     res.status(200).json({ success: true, data: newWorker.rows });
  //   } catch (error) {
  //     res.status(500).json({ success: false, msg: "Error Inserting Worker" });
  //   }
});

app.delete("/people/:rfc", async (req, res) => {
  try {
    const { rfc } = req.params;
    const results = await db.query(
      `DELETE FROM persona WHERE rfc = $1 RETURNING *`,
      [rfc]
    );
    console.log(results);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No person with RFC ${rfc}` });
    }
    res.status(200).json({
      success: true,
      length: results.rows.length,
      data: {
        person: results.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Deleting Person" });
  }
  //   const { rfc } = req.params;
  //   try {
  //     const deletedWorker = await pool.query(
  //       `DELETE FROM persona
  //             WHERE rfc = '${rfc}'
  //             RETURNING primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rfc`
  //     );

  //     // If there was a worker with the specified RFC, informs the user that the delete
  //     // operation was successful and returns the name and RFC of the deleted worker
  //     if (deletedWorker.rowCount !== 0) {
  //       return res.status(200).json({ success: true, data: deletedWorker.rows });
  //     }
  //     // If there was no worker with the specified RFC
  //     res.status(404).json({ success: false, msg: `No worker with RFC: ${rfc}` });
  //   } catch (err) {
  //     res.status(500).json({ success: false, msg: "Error Deleting Worker" });
  //   }
});

app.get("/people", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM persona");
    console.log(results);
    res.status(200).json({
      success: true,
      results: results.rows.length,
      data: {
        people: results.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting People" });
  }
  //   try {
  //     // const result = await pool.query("SET client_encoding to 'latin1'");
  //     // const result = await pool.query("SET client_encoding to 'utf8'");
  //     // const result = await pool.query("SET client_encoding to 'win1252'");
  //     // const result = await pool.query("SET client_encoding to 'SQL_ASCII'");
  //     // const result = await pool.query("SET client_encoding to 'Unicode'");
  //     // console.log(result);

  //     // Get Name or RFC user wants to search
  //     const { search } = req.query;
  //     let workers;
  //     // If the user wants to search for a specific person or RFC
  //     if (search) {
  //       workers = await pool.query(`SELECT primer_nombre, segundo_nombre,
  //             primer_apellido, segundo_apellido, rfc
  //             FROM persona
  //             WHERE primer_nombre ILIKE '${search}%'
  //             OR segundo_nombre ILIKE '${search}%'
  //             OR primer_apellido ILIKE '${search}%'
  //             OR segundo_apellido ILIKE '${search}%' ORDER BY primer_apellido`);
  //       if (workers.rowCount !== 0) {
  //         return res.status(200).json({ success: true, data: workers.rows });
  //       }
  //       return res
  //         .status(404)
  //         .json({ success: false, msg: `No matches with '${search}'` });
  //     }
  //     // If there is no specific search, it returns all workers on the database
  //     else {
  //       workers = await pool.query(`SELECT primer_nombre, segundo_nombre,
  //                 primer_apellido, segundo_apellido, rfc
  //                 FROM persona`);
  //       // const newPeople = people.rows.map(person => {
  //       //     const {
  //       //         primer_nombre, segundo_nombre,
  //       //         primer_apellido, segundo_apellido,
  //       //         rfc
  //       //     } = person;
  //       //     return {primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rfc};
  //       // });
  //       // console.log(newPeople);

  //       // res.send('Hello');
  //       res.status(200).json({ success: true, data: workers.rows });
  //     }
  //   } catch (err) {
  //     res.status(404).json({ success: false, msg: "Error getting data" });
  //   }
});

// POST request when user wants to upload a PDF Tax Receipt
app.post("/taxreceipt", async (req, res) => {
  try {
    // Decode QR code & get date from PDF Tax Receipt
    const decodedData = await decodePDFTaxReceipt(req);

    // Get the RFC and Date from the python script response
    const data = formatData(decodedData);

    // Create new Tax Receipt register in the Database
    await createTaxReceipt(data);

    // Insertion was successful
    res.status(200).json({ success: true, data: [data] });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
});

const createTaxReceipt = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    const { rfc, date } = data;
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const result = await pool.query(
      `SELECT * FROM comprobante_fiscal
            WHERE rfc_emisor = 'SUCC961125A15' 
            AND EXTRACT(MONTH FROM fecha_emision) = $1
            AND EXTRACT(YEAR FROM fecha_emision) = $2`,
      [month, year]
    );

    // If the Tax Receipt that has been uploaded already exists sends an error
    // message indicating the full name of the tax receipt owner and tax receipt month
    if (result.rowCount !== 0) {
      const person = await pool.query(
        `SELECT primer_nombre || ' ' || COALESCE(segundo_nombre || ' ', '') 
                || primer_apellido || ' ' || segundo_apellido AS nombre_completo
                FROM persona 
                WHERE rfc = $1`,
        [rfc]
      );
      const fullName = person.rows[0]["nombre_completo"];
      reject(
        `The Tax Receipt of ${fullName} for Month ${
          months[Number(month) - 1]
        } Already Exists`
      );
    }

    // If Tax Receipt doesn't exist, create a new register in the Tax Receipt table
    try {
      newTaxReceipt = await pool.query(
        `INSERT INTO comprobante_fiscal (fecha_emision, rfc_emisor) VALUES 
                ($1, $2)`,
        [date, rfc]
      );
      resolve();
    } catch (err) {
      reject("Error Inserting into Database");
    }
  });
};

const decodePDFTaxReceipt = (req) => {
  return new Promise((resolve, reject) => {
    let dataFromPythonScript = [];
    const busboy = new Busboy({ headers: req.headers });
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
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
      console.log("Done parsing form!, Calling Python Script...");
      // Calls python script for decoding the QR Code that is inside the
      // PDF Tax Receipt recently uploaded
      const process = spawn("py", [
        path.resolve(__dirname, "py", "readQR.py"),
        busboy.tmpPath,
      ]);
      // Receives what 'print' operations print in the python script
      process.stdout.on("data", (data) => {
        dataFromPythonScript.push(data.toString());
      });
      // When Python Script ends
      process.on("close", (code) => {
        if (code !== 0) {
          reject("Error on Python Script");
        } else {
          resolve(dataFromPythonScript);
        }
      });
    });
    req.pipe(busboy);
  });
};

const formatData = (dataFromPythonScript) => {
  // Remove blank spaces from the start and end of the string
  const data = dataFromPythonScript[0].trim();

  const startRFC = data.search("&re=");
  const endRFC = data.search("&rr=");
  const rfc = data.substring(startRFC + 4, endRFC);

  const endDate = data.length;
  const date = data.substring(endDate - 10, endDate);

  return { rfc, date };
};

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
