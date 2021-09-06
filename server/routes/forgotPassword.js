require("dotenv").config();
const router = require("express").Router();

// Connection to Database
const db = require("../db/index");

// Module required for sending emails
const nodemailer = require("nodemailer");

// Tax Receipt System's Email
const systemEmail = process.env.EMAILUSER;
const systemEmailPass = process.env.EMAILPASSWORD;

// Receiver Email
const testEmail = process.env.EMAILTEST;

// --------------------------------IMPORTING FUNCTIONS--------------------------------
const { issueJWT } = require("../functions/issueJWT");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Make sure user exists in database
    let results = await db.query(
      `SELECT * FROM users 
          WHERE email = $1`,
      [email]
    );

    // If email doesn't exist in the Database
    if (results.rowCount == 0) {
      return res
        .status(404)
        .json({ success: false, msg: "No existe usuario con ese Email" });
    }

    const user = results.rows[0];
    const { id } = user;
    // Make sure the user hasn't asked for changing his password yet
    results = await db.query(
      `SELECT * FROM recover_password 
      WHERE current_timestamp >= issue_time 
      AND current_timestamp <= expire_time
      AND user_id = $1`,
      [id]
    );

    // Cannot generate another link for changing the password
    // because the user has previously requested the link
    // and the 15 life minutes of the link haven't expired yet
    if (results.rowCount > 0) {
      // HTTP 'Forbiden' 403 code -> The request contained
      // valid data and was understood by the server,
      // but the server is refusing action
      return res.status(403).json({
        success: false,
        msg: "Ya hemos enviado un link a tu Email. Cuando caduque el link puedes volver a intentarlo",
      });
    }

    // User exists and the 15 minutes of the link's life have expired
    // Now create a one time link valid for 15min
    const linkTimeExpiration = 15; // 15 indicating you want the token to expire in 15 minutes
    const { token } = await issueJWT(user, linkTimeExpiration);
    await sendEmail(email, token);

    results = await db.query(
      `SELECT * FROM recover_password
       WHERE user_id = $1`,
      [id]
    );

    if (results.rowCount === 0) {
      await db.query(
        `INSERT INTO recover_password (issue_time, expire_time, 
        already_changed_password, user_id) VALUES
        (current_timestamp, 
        current_timestamp + (${linkTimeExpiration} * interval '1 minute'), 
        false, $1)`,
        [id]
      );
    } else {
      await db.query(
        `UPDATE recover_password 
        SET 
        issue_time = current_timestamp,
        expire_time = current_timestamp + (${linkTimeExpiration} * interval '1 minute'),
        already_changed_password = false
        WHERE user_id = $1`,
        [id]
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ success: false, msg: "Error Trying to Get User" });
  }
});

// ------------------------------------ FUNCTIONS ------------------------------------
const sendEmail = async (email, token) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: systemEmail,
      pass: systemEmailPass,
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Tax Receipt System 🚀" <${systemEmail}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "Cambio de Contraseña 🔄", // Subject line
      text: `¡Hola! 😄 Recibimos su solicitud de cambio de contraseña, si usted no la solicitó por favor ignore este mensaje, de lo contrario acceda al siguiente link para cambiar su contraseña:
http://localhost:3000/change-password/${token} Nota: El link expira en 15 minutos. Si no lo hace dentro de los próximos 15 minutos, por favor vuelva a generar otra solitud en el siguiente link: http://localhost:3000/forgot-password ¡Gracias! Que tenga un lindo dia 🌈
      `, // plain text body
    });
  } catch (err) {
    console.log({ err });
  }
};

module.exports = router;
