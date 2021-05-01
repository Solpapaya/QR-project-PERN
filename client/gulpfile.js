const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// Function that compiles SASS
function css() {
  return (
    src("scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer(), cssnano()]))
      // .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write("."))
      .pipe(dest("./src"))
  );
}

function watchFiles() {
  watch("scss/**/*.scss", css);
}

exports.default = parallel(css, watchFiles);
