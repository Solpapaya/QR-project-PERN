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
    const results = await db.query(
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

    // User exists and now create a one time link valid for 15min
    const timeExpiration = 15; // 15 indicating you want the token to expire in 15 minutes
    const { token } = await issueJWT(results.rows[0], timeExpiration);
    sendEmail(email, token);

    res.status(200).json({ success: true, token });
  } catch (err) {
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
      to: `${testEmail}`, // list of receivers
      subject: "Cambio de Contraseña 🔄", // Subject line
      text: `¡Hola! 😄 Recibimos su solicitud de cambio de contraseña, 
si usted no la solicitó por favor ignore este mensaje, de lo 
contrario acceda al siguiente link para cambiar su contraseña:
http://localhost:3000/change-password/${token}
      
      
Nota: El link expira en 15 minutos. Si no lo hace dentro de los próximos
15 minutos, por favor vuelva a generar otra solitud en el siguiente link:
http://localhost:3000/forgot-password

¡Gracias! Que tenga un lindo dia 🌈
      `, // plain text body
    });
  } catch (err) {
    console.log({ err });
  }
};

module.exports = router;
