const jsonwebtoken = require("jsonwebtoken");

const { PRIV_KEY } = require("../consts/variables");

const issueJWT = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = user;

      const expiresIn = 30; // 1hour or 60*60

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
