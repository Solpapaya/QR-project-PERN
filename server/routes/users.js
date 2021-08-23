const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// --------------------------------IMPORTING FUNCTIONS--------------------------------
const { generatePassword } = require("../functions/passwords");
const { validEmail } = require("../functions/email");

// --------------------------------IMPORTING MIDDLEWARE--------------------------------
const {
  authUser,
  getRole,
  forbiddenRole,
} = require("../middleware/authorization");

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

    if (!validEmail(email)) {
      return res
        .status(400)
        .json({ success: false, msg: "Introduce un Email Válido" });
    }

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

router.get(
  "/",
  authUser,
  getRole,
  forbiddenRole("Consulta"),
  async (req, res) => {
    const { types } = req.query;
    const { userType } = req;
    if (types) {
      let results;
      switch (userType) {
        case "Master":
          results = await db.query(
            `SELECT * 
            FROM user_type EXCEPT select * from user_type WHERE type = 'Master'`,
            []
          );
          break;
        case "Admin":
          results = await db.query(
            `SELECT * 
            FROM user_type 
            EXCEPT 
            SELECT * 
            FROM user_type 
            WHERE (type = 'Master' OR type = 'Admin')`,
            []
          );
          break;
      }

      res.status(200).json({ success: true, user_types: results.rows });
    } else {
      let results;
      try {
        results = await db.query(
          `SELECT u.id, u.first_name, u.second_name, 
            u.surname, u.second_surname, u.email,
            t.type
            FROM users as u
            INNER JOIN user_type as t
            ON u.type_id = t.id
            ORDER BY u.second_name`,
          []
        );
      } catch (err) {
        res
          .status(500)
          .json({ success: false, msg: "Error al obtener usuarios" });
      }
      res.status(200).json({ success: true, users: results.rows });
    }
  }
);

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
