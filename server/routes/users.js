const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// --------------------------------IMPORTING FUNCTIONS--------------------------------
const { generatePassword } = require("../functions/generatePassword");

// --------------------------------ROUTES--------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      first_name,
      second_name,
      surname,
      second_surname,
      email,
      password,
      user_type,
    } = req.body;

    await checkIfUserAlreadyExists(email);

    const { salt, hash } = await generatePassword(password);

    const userTypeID = await getUserTypeId(user_type);

    const results = await db.query(
      `INSERT INTO users (first_name, second_name, surname, second_surname, email, password,
            salt, type_id) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        first_name,
        second_name,
        surname,
        second_surname,
        email,
        hash,
        salt,
        userTypeID,
      ]
    );

    if (results.rowCount > 0)
      res.status(200).json({ success: true, user: results.rows[0] });
  } catch (err) {
    if (err.status)
      res.status(err.status).json({ success: false, msg: err.msg });
    else
      res.status(500).json({ success: false, msg: "Error al crear usuario" });
  }
});

// --------------------------------FUNCTIONS--------------------------------
const checkIfUserAlreadyExists = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await db.query(
        `SELECT *
              FROM users
              WHERE email = $1`,
        [email]
      );
      if (results.rowCount > 0)
        reject({ status: 409, msg: "Ya existe un usuario con este email" });
      else resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const getUserTypeId = (userType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await db.query(
        `SELECT id 
          FROM user_type
          WHERE type = $1`,
        [userType]
      );
      resolve(results.rows[0].id);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = router;
