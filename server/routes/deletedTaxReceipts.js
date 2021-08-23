const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// Month Array for convertion
const { months } = require("../consts/variables");

// --------------------------------IMPORTING MIDDLEWARE--------------------------------
const {
  authUser,
  getRole,
  forbiddenRole,
} = require("../middleware/authorization");

router.get(
  "/",
  authUser,
  getRole,
  forbiddenRole("Consulta"),
  async (req, res) => {
    const { get } = req.query;
    try {
      if (get === "years") {
        const results = await db.query(
          `SELECT DISTINCT EXTRACT(YEAR FROM deleted_on) as years FROM deleted_tax_receipts ORDER BY EXTRACT(YEAR FROM deleted_on) DESC`,
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
          `SELECT 
            EXTRACT(YEAR FROM dtx.deleted_on) as year, 
            EXTRACT(MONTH FROM dtx.deleted_on) as month,
            TO_CHAR(dtx.tax_receipt_date, 'dd/mm/yyyy') as tax_receipt_date,
            dtx.tax_receipt_emitter as rfc_tax_receipt_emitter, 
            TO_CHAR(DATE(dtx.deleted_on), 'dd/mm/yyyy') as deleted_on_date,
            TO_TIMESTAMP( CAST (dtx.deleted_on AS VARCHAR), 'YYYY-MM-DD HH24:MI:SS')::time as deleted_on_time,
            dtx.why_was_deleted, 
            u.email,
            p.first_name || ' ' || COALESCE(p.second_name || ' ', '') 
            || p.surname || ' ' || p.second_surname as tax_emitter_full_name,
            u.first_name || ' ' || COALESCE(u.second_name || ' ', '') 
            || u.surname || ' ' || u.second_surname as user_full_name
            FROM deleted_tax_receipts as dtx
            INNER JOIN person as p
            ON dtx.tax_receipt_emitter = p.rfc
            INNER JOIN users as u
            ON dtx.deleted_by = u.id
            ORDER BY dtx.deleted_on DESC`,
          []
        );
        if (results.rowCount === 0) {
          return res.status(404).json({
            success: false,
            msg: `No Deleted Tax Receipts`,
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
      res
        .status(500)
        .json({ success: false, msg: "Error Getting Deleted Tax Receipts" });
    }
  }
);

module.exports = router;
