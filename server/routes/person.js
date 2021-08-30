const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

router.get("/taxreceipts/:rfc", async (req, res) => {
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
        `SELECT 
        tax.id,
        extract(month from tax.date) AS month, 
        extract(year from tax.date) AS year,
        p.first_name || ' ' || COALESCE(p.second_name || ' ', '') 
        || p.surname || ' ' || p.second_surname as full_name
        FROM tax_receipt as tax
        INNER JOIN person as p
        ON tax.rfc_emitter = p.rfc
        WHERE rfc_emitter = $1 
        ORDER BY date DESC`,
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

module.exports = router;
