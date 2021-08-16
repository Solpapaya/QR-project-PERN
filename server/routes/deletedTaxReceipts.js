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
        res.send("Hello");
        //   const results = await db.query(
        //     `SELECT tax_receipt.id, EXTRACT(YEAR FROM tax_receipt.date) as year,
        //         EXTRACT(MONTH FROM tax_receipt.date) as month,
        //         person.first_name || ' ' || COALESCE(person.second_name || ' ', '')
        //         || person.surname || ' ' || person.second_surname as full_name, person.rfc
        //         FROM person INNER JOIN tax_receipt
        //         ON person.rfc = tax_receipt.rfc_emitter
        //         ORDER BY tax_receipt.date DESC`,
        //     []
        //   );
        //   if (results.rowCount === 0) {
        //     return res.status(404).json({
        //       success: false,
        //       msg: `No tax receipts`,
        //     });
        //   }
        //   res.status(200).json({
        //     success: true,
        //     length: results.rows.length,
        //     data: {
        //       tax_receipts: results.rows,
        //     },
        //   });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, msg: "Error Getting Deleted Tax Receipts" });
    }
  }
);

module.exports = router;
