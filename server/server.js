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
// Creates new directory for storing temporary files if it doesn't already exist
if (!fs.existsSync(tmpDirectory)) {
  fs.mkdirSync(tmpDirectory);
}
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
const { resolve } = require("path");

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
    // If there is no specific search, it returns all people on the database
    else {
      const results = await db.query(`SELECT person.first_name, 
      person.second_name, person.surname, person.second_surname, person.rfc, 
      person.active, 
      TO_CHAR(person.creation_date, 'dd/mm/yyyy') as creation_date,
      department.department_name
      FROM person LEFT JOIN department
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
                FROM person LEFT JOIN department
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
    const results = await db.query(
      `SELECT * FROM department ORDER BY department_name`,
      []
    );
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

app.get("/departments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db.query(
      `SELECT department_name FROM department WHERE id = $1`,
      [id]
    );
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No department with ID ${id}` });
    }
    res.status(200).json({
      success: true,
      data: results.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Getting Department" });
  }
});

app.put("/departments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { department_name } = req.body;

    let results = await db.query(
      `UPDATE department
          SET department_name = $1
          WHERE id = $2 RETURNING *`,
      [department_name, id]
    );

    if (results.rowCount === 0) {
      return res.status(404).json({
        success: false,
        msg: `No department with ID ${id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: {
        department: results.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Updating Department" });
  }
});

app.post("/departments", async (req, res) => {
  try {
    const { department_name } = req.body;
    await checkIfDepartmentAlreadyExists(department_name);
    const results = await db.query(
      `INSERT INTO department (department_name) VALUES
        ($1) RETURNING *`,
      [department_name]
    );
    res.status(200).json({
      success: true,
      data: {
        department: results.rows[0],
      },
    });
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ success: false, msg: err.msg });
    } else {
      res.status(500);
      res.status(500).json({ success: false, msg: "Error Adding Department" });
    }
  }
});

const checkIfDepartmentAlreadyExists = async (department_name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await db.query(
        `SELECT * FROM department 
        WHERE department_name ILIKE $1`,
        [department_name]
      );
      if (results.rowCount > 0) {
        reject({ status: 409, msg: `El área "${department_name}" ya existe` });
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

app.delete("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      `DELETE FROM department
      WHERE id = $1`,
      [id]
    );
    // If there was no tax_receipt with the ID
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No Department with the ID: ${id}` });
    }
    // If there was a tax receipt with the specified ID, informs the user that the delete
    // operation was successful and returns the Date and RFC of the deleted tax receipt
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error Deleting Department" });
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

app.get("/taxreceipts/:id", async (req, res) => {
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

app.get("/person/taxreceipts/:rfc", async (req, res) => {
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

app.put("/taxreceipts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Get the RFC and Date of the tax receipt that wants to be updated
    const currentData = await getDataFromCurrentTax(id);

    const { month, year, rfc } = currentData;

    // Decode QR code & get date from the new PDF Tax Receipt
    const decodedData = await decodePDFTaxReceipt(req);

    // Get the RFC and Date from the python script response
    const newData = formatData(decodedData);

    if (newData.rfc !== rfc)
      return res.status(400).json({
        success: false,
        msg: `The tax receipt you want to upload is not from the same person you want to modify it from`,
      });

    const splittedDate = splitDate(newData.date);
    if (splittedDate.year === year && splittedDate.month === month) {
      return res.status(403).json({
        success: false,
        msg: `The tax receipt you want to update with is the same as the current one`,
      });
    }

    // Check if the new tax receipt already exists in the database
    await checkTaxAlreadyExists(
      splittedDate.year,
      splittedDate.month,
      newData.rfc
    );

    // Updates the tax receipt
    const results = await updateTaxReceipt(
      `${splittedDate.year}-${splittedDate.month}-01`,
      id
    );

    res.status(200).json({ success: true });
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ success: false, msg: err.msg });
    } else {
      res
        .status(500)
        .json({ success: false, msg: "Error Updating Tax Receipt" });
    }
  }
});

const checkTaxAlreadyExists = (year, month, rfc) => {
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
          msg: `Error, There is already a Tax Receipt with the Month: ${
            months[month - 1]
          } and Year: ${year}`,
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

app.delete("/taxreceipts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      `DELETE FROM tax_receipt WHERE id = $1 
      RETURNING 
      EXTRACT(MONTH FROM tax_receipt.date) as month,
      EXTRACT(YEAR FROM tax_receipt.date) as year,
      rfc_emitter`,
      [id]
    );
    // If there was no tax_receipt with the ID
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, msg: `No Tax Receipt with the ID: ${id}` });
    }
    // If there was a tax receipt with the specified ID, informs the user that the delete
    // operation was successful and returns the Date and RFC of the deleted tax receipt
    res.status(200).json({
      success: true,
      tax: results.rows[0],
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
    const newTaxReceipt = await createTaxReceipt(data);

    // // Insertion was successful
    res.status(200).json({ success: true, data: newTaxReceipt });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
});

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
      reject({ fullName, year, month });
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
        reject("Error Inserting into Database");
      }
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
      const process = spawn("python3", [
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
