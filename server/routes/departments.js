const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

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

router.get("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

module.exports = router;
