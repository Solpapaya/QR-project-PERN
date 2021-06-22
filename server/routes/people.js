const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// Function used for searching people if the search string has more than 1 word
const { runPermutations } = require("../functions/permutations");
// Gets Today's date
const { getDate } = require("../functions/getDate");

router.get("/", async (req, res) => {
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

router.get("/:rfc", async (req, res) => {
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

router.post("/", async (req, res) => {
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
    if (err.code == 23505) {
      const { rfc } = req.body;
      return res.status(409).json({
        success: false,
        msg: `Ya existe una persona con el RFC: "${rfc}"`,
      });

      // .json({ success: false, msg: `Person with RFC ${rfc} already exists` });
    }
    res.status(500).json({ success: false, msg: "Error Creating Person" });
  }
});

router.put("/:rfc", async (req, res) => {
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
      // if (results.rowCount === 0) {
      //   return res.status(404).json({
      //     success: false,
      //     msg: `No person with RFC ${req.params.rfc}`,
      //   });
      // }
      res.status(200).json({
        success: true,
        data: {
          person: results.rows[0],
        },
      });
    }
  } catch (err) {
    if (err.code == 23505) {
      const { rfc } = req.body;
      return res.status(409).json({
        success: false,
        msg: `Ya existe una persona con el RFC: "${rfc}"`,
      });
    }
    res
      .status(500)
      .json({ success: false, msg: "No se pudo actualizar la persona" });
    // res.status(500).json({ success: false, msg: "Error Updating Person" });
  }
});

router.delete("/:rfc", async (req, res) => {
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

module.exports = router;
