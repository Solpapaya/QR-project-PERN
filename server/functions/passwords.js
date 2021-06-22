const crypto = require("crypto");

const generatePassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // For seeing why the normalize function, go to: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      password = password.normalize("NFC");
      const salt = await crypto.randomBytes(32).toString("hex");
      // pbkdf2Sync documentation: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
      const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
      resolve({ salt, hash });
    } catch (err) {
      reject("Error en contraseña");
    }
  });
};

const validatePassword = (password, hash, salt) => {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashVerify === hash;
};

module.exports = {
  generatePassword,
  validatePassword,
};
