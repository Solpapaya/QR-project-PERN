const path = require("path");

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

module.exports = {
  months,
  tmpDirectory,
  keyPairDirectory,
};
