const jsonwebtoken = require("jsonwebtoken");

const { PRIV_KEY } = require("../consts/variables");

const issueJWT = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = user;

      const expiresIn = 60 * 2; // 2 minutes

      const payload = {
        sub: id,
        iat: Date.now(),
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
