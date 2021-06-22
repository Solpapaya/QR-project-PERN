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

module.exports = {
  months,
  tmpDirectory,
};
