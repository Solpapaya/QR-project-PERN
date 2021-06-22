const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

router.get("/", async (req, res) => {
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

router.get("/:rfc", async (req, res) => {
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

module.exports = router;
