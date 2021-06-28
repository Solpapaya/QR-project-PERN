const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");

// ------------------------------------KEY------------------------------------
const { keyPairDirectory } = require("../consts/variables");
const PUB_KEY = fs.readFileSync(keyPairDirectory + "/rsa_pub.pem", "utf8");

// Connection to Database
const db = require("../db/index");

const authUser = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res
        .status(401)
        .json({ success: false, msg: "No estás Autorizado" });
    }

    const payload = await jsonwebtoken.verify(jwtToken, PUB_KEY, {
      algorithms: ["RS256"],
    });

    req.payload = payload;
    next();
  } catch (err) {
    // if (err.name === "TokenExpiredError")
    //   res
    //     .status(401)
    //     .json({ success: false, msg: "Se ha acabado tu tiempo de sesión" });
    // else
    return res.status(401).json({ success: false, msg: "No estás Autorizado" });
  }
};

const getRole = async (req, res, next) => {
  try {
    const { sub } = req.payload;
    const results = await db.query(
      `SELECT user_type.type 
    FROM users
    INNER JOIN user_type
    ON users.type_id = user_type.id
    WHERE users.id = $1 `,
      [sub]
    );

    const userType = results.rows[0].type;

    req.userType = userType;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "No estás Autorizado" });
  }
};

module.exports = {
  authUser,
  getRole,
};
