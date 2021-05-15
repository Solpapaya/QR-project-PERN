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

const getDate = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const newDate = year + "/" + month + "/" + day;
  return newDate;
};

// Accept request from other domains
app.use(cors());
// Serve static resources like index.html, styles, JavaScript logic
app.use(express.static(path.resolve(__dirname, "public")));
// Parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

// Function used for searching people if the search string has more than 1 word
const { runPermutations } = require("./functions/permutations");

app.put("/people/:rfc", async (req, res) => {
  const { field } = req.query;
  try {
    if (field === "active") {
      const { active } = req.body;
      let results = await db.query(
        `UPDATE person SET active = $1
          WHERE rfc = $2 RETURNING *`,
        [active, req.params.rfc]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No person with RFC ${req.params.rfc}`,
        });
      }

      const date = getDate();
      await db.query(
        `INSERT INTO status_logs 
        (person_rfc, log_date, new_status) 
        VALUES
        ($1, $2, $3)`,
        [req.params.rfc, date, active]
      );
      res.status(200).json({
        success: true,
        data: {
          person: results.rows[0],
        },
      });
    } else {
      const {
        first_name,
        second_name,
        surname,
        second_surname,
        rfc,
        department_name,
      } = req.body;

      let results = await db.query(
        `SELECT id
      FROM department
      WHERE department_name ILIKE $1`,
        [department_name]
      );

      const department_id = results.rows[0].id;

      results = await db.query(
        `UPDATE person SET first_name = $1, second_name = $2,
          surname = $3, second_surname = $4, rfc = $5, department_id = $6
          WHERE rfc = $7 RETURNING *`,
        [
          first_name,
          second_name,
          surname,
          second_surname,
          rfc,
          department_id,
          req.params.rfc,
        ]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No person with RFC ${req.params.rfc}`,
        });
      }
      res.status(200).json({
        success: true,
        data: {
          person: results.rows[0],
        },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Updating Person" });
  }
});

app.post("/people", async (req, res) => {
  try {
    const {
      first_name,
      second_name,
      surname,
      second_surname,
      rfc,
      department_name,
    } = req.body;
    let results = await db.query(
      `SELECT id
      FROM department
      WHERE department_name ILIKE $1`,
      [department_name]
    );

    const department_id = results.rows[0].id;
    const date = getDate();

    results = await db.query(
      `INSERT INTO person (first_name, second_name,
        surname, second_surname, rfc, department_id,
        active, creation_date) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        first_name,
        second_name,
        surname,
        second_surname,
        rfc,
        department_id,
        1,
        date,
      ]
    );
    res.status(200).json({
      success: true,
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
  const { search } = req.query;
  try {
    // If the user wants to search for a specific person or RFC
    if (search) {
      // If the search only contains one word
      if (search.split(" ").length === 1) {
        const results = await db.query(
          `SELECT person.first_name, person.second_name, person.surname,
                person.second_surname, person.rfc, person.active, 
                TO_CHAR(person.creation_date, 'dd/mm/yyyy') as creation_date,
                department.department_name
                FROM person INNER JOIN department
                ON person.department_id = department.id
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
      // If the search only contains more than word (Meaning, the user wants to search for
      // a first_name and a surname or second_name with a second_surname or a first_name with
      // surname and second_name, etc...)
      else {
        const words = search.split(" ");
        let strToSearch = "";
        for (let i = 0; i < words.length; i++) {
          if (i === words.length - 1) {
            strToSearch += `${words[i]}%`;
          } else {
            strToSearch += `${words[i]}% `;
          }
        }

        let indexes = [];
        let initialQuery = `SELECT person.first_name, person.second_name, person.surname,
            person.second_surname, person.rfc, person.active,
            TO_CHAR(person.creation_date, 'dd/mm/yyyy') as creation_date,
            department.department_name
            FROM person INNER JOIN department
            ON person.department_id = department.id WHERE `;
        let firstPermutation = true;
        const arr = ["first_name", "second_name", "surname", "second_surname"];

        // Creates a query that will look for all possible combinations in which you can order
        // the first_name, second_name, surname and second_surname with the number of words
        // the user has given.
        // I.E if the user passes Sol Dan this 2 words could be either Sol-> first_name and Dan -> surname
        // or Sol-> first_name and Dan-> second_surname or Dan-> first_name and Sol -> surname
        // So, this query looks for all possible combinations because the user could be looking
        // for a person by inserting his first_name and second_surname or second_surname and surname
        // but its still the same person that he wants to search, the only difference is the order
        // of the words
        let query = runPermutations(
          words.length,
          indexes,
          initialQuery,
          firstPermutation,
          arr
        );

        query += "ORDER BY surname";

        const results = await db.query(query, [strToSearch]);
        if (results.rowCount === 0) {
          return res.status(404).json({
            success: false,
            msg: `No matches for ${search}`,
          });
        }
        res.status(200).json({
          success: true,
          data: {
            people: results.rows,
          },
        });
      }
    }
    // If there is no specific search, it returns all workers on the database
    else {
      const results = await db.query(`SELECT person.first_name, 
      person.second_name, person.surname, person.second_surname, person.rfc, 
      person.active, 
      TO_CHAR(person.creation_date, 'dd/mm/yyyy') as creation_date,
      department.department_name
      FROM person INNER JOIN department
      ON person.department_id = department.id
      ORDER BY surname`);
      res.status(200).json({
        success: true,
        results: results.rows.length,
        data: {
          people: results.rows,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Error Getting People" });
  }
});

app.get("/people/:rfc", async (req, res) => {
  const { rfc } = req.params;
  try {
    const results = await db.query(
      `SELECT person.first_name, person.second_name, person.surname,
                person.second_surname, person.rfc, 
                department.department_name
                FROM person INNER JOIN department
                ON person.department_id = department.id
                 WHERE rfc ILIKE $1`,
      [rfc]
    );
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

app.get("/departments", async (req, res) => {
  try {
    const results = await db.query(`SELECT * FROM department`, []);
    res.status(200).json({
      success: true,
      data: {
        departments: results.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting Person" });
  }
});

app.get("/statuslogs", async (req, res) => {
  const { get } = req.query;
  try {
    if (get === "years") {
      const results = await db.query(
        `SELECT DISTINCT EXTRACT(YEAR FROM log_date) 
        as years 
        FROM status_logs 
        ORDER BY EXTRACT(YEAR FROM log_date) DESC `,
        []
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No status logs`,
        });
      }
      res.status(200).json({
        success: true,
        length: results.rows.length,
        data: {
          status_logs_years: results.rows,
        },
      });
    } else {
      const results = await db.query(
        `SELECT status_logs.id, 
        TO_CHAR(status_logs.log_date, 'dd/mm/yyyy') as date, 
        status_logs.new_status,
        person.first_name || ' ' || 
        COALESCE(person.second_name || ' ', '') 
        || person.surname || ' ' || 
        person.second_surname as full_name, 
        person.rfc
        FROM person INNER JOIN status_logs
        ON person.rfc = status_logs.person_rfc
        ORDER BY status_logs.log_date DESC;`,
        []
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No status logs`,
        });
      }
      res.status(200).json({
        success: true,
        length: results.rows.length,
        data: {
          status_logs: results.rows,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting Status Logs" });
  }
});

app.get("/statuslogs/:rfc", async (req, res) => {
  const { rfc } = req.params;
  const { get } = req.query;
  try {
    if (get && get === "years") {
      const results = await db.query(
        `SELECT DISTINCT EXTRACT(YEAR FROM log_date) as years
         FROM status_logs
         WHERE person_rfc = $1 
         ORDER BY EXTRACT(YEAR FROM log_date) DESC `,
        [rfc]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No status logs for person with RFC ${rfc}`,
        });
      }
      res.status(200).json({
        success: true,
        length: results.rows.length,
        data: {
          status_logs_years: results.rows,
        },
      });
    } else {
      const results = await db.query(
        `SELECT id, TO_CHAR(log_date, 'dd/mm/yyyy') as date, new_status
          FROM status_logs 
          WHERE person_rfc = $1
          ORDER BY log_date DESC`,
        [rfc]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No status logs for person with RFC ${rfc}`,
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
    res.status(500).json({
      success: false,
      msg: `Error Getting Status Logs for person with RFC ${rfc}`,
    });
  }
});

app.get("/taxreceipts", async (req, res) => {
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
        `SELECT EXTRACT(YEAR FROM tax_receipt.date) as year, 
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

app.get("/taxreceipts/:rfc", async (req, res) => {
  const { rfc } = req.params;
  const { get } = req.query;
  try {
    if (get === "years") {
      const results = await db.query(
        `SELECT DISTINCT EXTRACT(YEAR FROM date) as years FROM tax_receipt where rfc_emitter = $1 ORDER BY EXTRACT(YEAR FROM date) DESC `,
        [rfc]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No tax receipts for person with RFC ${rfc}`,
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
        `SELECT id, extract(month from date) AS month, extract(year from date) AS year FROM tax_receipt WHERE rfc_emitter = $1 ORDER BY date DESC`,
        [rfc]
      );
      if (results.rowCount === 0) {
        return res.status(404).json({
          success: false,
          msg: `No tax receipts for person with RFC ${rfc}`,
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
    res.status(500).json({ success: false, msg: "Error Getting Person" });
  }
});

app.delete("/taxreceipts", async (req, res) => {
  try {
    const { rfc, id } = req.query;
    const results = await db.query(
      `DELETE FROM tax_receipt WHERE rfc_emitter = $1 AND id = $2 RETURNING *`,
      [rfc, id]
    );
    // If there was no tax_receipt with the specified RFC and ID
    if (results.rowCount === 0) {
      return res.status(404).json({ success: false, msg: `No Tax Receipt` });
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
    res.status(500).json({ success: false, msg: "Error Deleting Tax Receipt" });
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
