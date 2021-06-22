const path = require("path");
const fs = require("fs");

// Month Array for convertion
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Path for saving submitted file
const dirname = path.dirname(__dirname);
const tmpDirectory = path.resolve(dirname, "tmp");

// Path for saving key pair
const keyPairDirectory = path.resolve(dirname, "keys");

// Path to keys
const PRIV_KEY = fs.readFileSync(keyPairDirectory + "/rsa_priv.pem", "utf8");
const PUB_KEY = fs.readFileSync(keyPairDirectory + "/rsa_pub.pem", "utf8");

module.exports = {
  months,
  tmpDirectory,
  keyPairDirectory,
  PRIV_KEY,
  PUB_KEY,
};
