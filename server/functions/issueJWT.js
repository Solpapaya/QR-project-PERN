const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");

// ------------------------------------KEY------------------------------------
const { keyPairDirectory } = require("../consts/variables");
const PRIV_KEY = fs.readFileSync(keyPairDirectory + "/rsa_priv.pem", "utf8");

const issueJWT = (user, timeExpiration) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = user;

      const expiresIn = 60 * timeExpiration; // 1hour -> 60*60, 15min -> 60 * 15

      const payload = {
        sub: id,
      };

      const signedToken = await jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn,
        algorithm: "RS256",
      });

      resolve({
        token: signedToken,
        expires: expiresIn,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  issueJWT,
};
