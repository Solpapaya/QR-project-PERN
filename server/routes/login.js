const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// --------------------------------IMPORTING FUNCTIONS--------------------------------
const { validatePassword } = require("../functions/passwords");
const { issueJWT } = require("../functions/issueJWT");
const { validEmail } = require("../functions/email");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validEmail(email)) {
      return res
        .status(401)
        .json({ success: false, msg: "Credenciales inválidas" });
    }

    const user = await searchUser(email);
    if (validatePassword(password, user.password, user.salt)) {
      const { token, expires } = await issueJWT(user);
      res.send({ token, expires });
    } else {
      res.status(401).json({ success: false, msg: "Credenciales inválidas" });
    }
  } catch (err) {
    if (err.status)
      res.status(err.status).json({ success: false, msg: err.msg });
    else
      res
        .status(500)
        .json({ success: false, msg: "No se pudo iniciar sesión" });
  }
});

const searchUser = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await db.query(
        `SELECT * 
            FROM users WHERE email = $1`,
        [email]
      );

      if (results.rowCount > 0) resolve(results.rows[0]);
      else reject({ status: 401, msg: "Credenciales inválidas" });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = router;
