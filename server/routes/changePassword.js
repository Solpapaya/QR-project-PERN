const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// --------------------------------IMPORTING FUNCTIONS--------------------------------
const { generatePassword } = require("../functions/passwords");

// --------------------------------IMPORTING MIDDLEWARE--------------------------------
const { authUser } = require("../middleware/authorization");

router.get("/", authUser, async (req, res) => {
  try {
    const userID = req.payload.sub;

    const results = await db.query(
      `SELECT * FROM recover_password
        WHERE already_changed_password = true
        AND user_id = $1
        AND current_timestamp >= issue_time 
        AND current_timestamp <= expire_time`,
      [userID]
    );

    if (results.rowCount > 0) {
      return res.status(403).json({
        success: false,
        msg: `Lo sentimos 😞, ya has usado este link para cambiar tu constraseña. 
        Si quieres volver a cambiarla espera a que expire tu link anterior para que puedas 
        solicitar nuevamente el cambio de contraseña`,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Error Trying to Validate Link" });
  }
});

// Maybe delete 'authUser' middleware if we add the get function
router.put("/", authUser, async (req, res) => {
  try {
    const userID = req.payload.sub;
    const { password } = req.body;

    // Change the password of the User
    const { salt, hash } = await generatePassword(password);
    await db.query(
      `UPDATE users
        SET password = $1,
        salt = $2
        WHERE id = $3`,
      [hash, salt, userID]
    );

    await db.query(
      `UPDATE recover_password 
        SET 
        already_changed_password = true
        WHERE user_id = $1`,
      [userID]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.log({ err });
    res
      .status(500)
      .json({ success: false, msg: "Error Trying to Change Password" });
  }
});

module.exports = router;
