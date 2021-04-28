require("dotenv").config();
const cors = require("cors");
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
const db = require("./db/index");

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

// Accept request from other domains
app.use(cors());
// Serve static resources like index.html, styles, JavaScript logic
app.use(express.static(path.resolve(__dirname, "public")));
// Parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.put("/people/:rfc", async (req, res) => {
  try {
    const {
      first_name,
      second_name,
      surname,
      second_surname,
      rfc,
      active,
    } = req.body;
    const results = await db.query(
      `UPDATE person SET first_name = $1, second_name = $2,
        surname = $3, second_surname = $4, rfc = $5, active = $6 
        WHERE rfc = $7 RETURNING *`,
      [
        first_name,
        second_name,
        surname,
        second_surname,
        rfc,
        active,
        req.params.rfc,
      ]
    );
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No person with RFC ${req.params.rfc}` });
    }
    res.status(200).json({
      success: true,
      data: {
        person: results.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Updating Person" });
  }
});

app.post("/people", async (req, res) => {
  try {
    const { first_name, second_name, surname, second_surname, rfc } = req.body;
    const results = await db.query(
      `INSERT INTO person (first_name, second_name, surname, second_surname, rfc) VALUES
    ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, second_name, surname, second_surname, rfc]
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
    res.status(500).json({ success: false, msg: "Error Creating Person" });
  }
});

app.delete("/people/:rfc", async (req, res) => {
  try {
    const { rfc } = req.params;
    const results = await db.query(
      `DELETE FROM person WHERE rfc = $1 RETURNING *`,
      [rfc]
    );
    // If there was no worker with the specified RFC
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No person with RFC ${rfc}` });
    }
    // If there was a worker with the specified RFC, informs the user that the delete
    // operation was successful and returns the name and RFC of the deleted worker
    res.status(200).json({
      success: true,
      data: {
        person: results.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Deleting Person" });
  }
});

app.get("/people", async (req, res) => {
  // Get Name or RFC user wants to search
  const { search, active } = req.query;
  try {
    // // If the user wants to search for a specific person who is active or inactive
    // if (search && active) {
    //   const results = await db.query(
    //     `SELECT * FROM person
    //            WHERE (first_name ILIKE $1
    //            OR second_name ILIKE $1
    //            OR surname ILIKE $1
    //            OR second_surname ILIKE $1
    //            OR rfc ILIKE $1)
    //            AND
    //            (active = $2)
    //            ORDER BY surname`,
    //     [search + "%", active]
    //   );
    //   if (results.rowCount === 0) {
    //     return res.status(404).json({
    //       success: false,
    //       msg: `No matches for ${search}`,
    //     });
    //   }
    //   res.status(200).json({
    //     success: true,
    //     length: results.rows.length,
    //     data: {
    //       people: results.rows,
    //     },
    //   });
    // }
    // // If the user wants to search only active or inactive people
    // else if (active) {
    //   const results = await db.query(
    //     `SELECT * FROM person
    //            WHERE active = $1
    //            ORDER BY surname`,
    //     [active]
    //   );
    //   if (results.rowCount === 0) {
    //     return res.status(404).json({
    //       success: false,
    //       msg: active == "1" ? "No active people" : "No inactive people",
    //     });
    //   }
    //   res.status(200).json({
    //     success: true,
    //     length: results.rows.length,
    //     data: {
    //       people: results.rows,
    //     },
    //   });
    // }
    // If the user wants to search for a specific person or RFC
    if (search) {
      const results = await db.query(
        `SELECT * FROM person
               WHERE first_name ILIKE $1
               OR second_name ILIKE $1
               OR surname ILIKE $1
               OR second_surname ILIKE $1
               OR rfc ILIKE $1
               ORDER BY surname`,
        [search + "%"]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No matches for ${search}`,
        });
      }
      res.status(200).json({
        success: true,
        length: results.rows.length,
        data: {
          people: results.rows,
        },
      });
    }
    // If there is no specific search, it returns all workers on the database
    else {
      const results = await db.query("SELECT * FROM person ORDER BY surname");
      res.status(200).json({
        success: true,
        results: results.rows.length,
        data: {
          people: results.rows,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting People" });
  }
});

app.get("/people/:rfc", async (req, res) => {
  const { rfc } = req.params;
  try {
    const results = await db.query(`SELECT * FROM person WHERE rfc = $1`, [
      rfc,
    ]);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No person with RFC ${rfc}` });
    }
    res.status(200).json({
      success: true,
      data: {
        person: results.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting Person" });
  }
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
        `SELECT first_name || ' ' || COALESCE(second_name || ' ', '') 
                || surname || ' ' || second_surname AS nombre_completo
                FROM person 
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
