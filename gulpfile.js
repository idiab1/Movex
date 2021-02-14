let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let concat = require('gulp-concat');
let imagemin = require('gulp-imagemin');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let browsersync = require('browser-sync');
let uglify = require("gulp-uglify");
let pug = require("gulp-pug");

// ->> pug_compile is a task for compile pug.js to html
async function pug_compile() {
  return gulp.src('src/**/*.pug')
    .pipe(pug({
      pretty: true}))
    .pipe(gulp.dest("dist"))
    .pipe(browsersync.stream())
}

// ->> Style is a task for compile pre-processor like scss to css
async function styles(){
  return gulp.src('src/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(browsersync.stream())
}


// This is task for uglify/minifying JavaScript
async function scripts(){
  return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browsersync.stream())
}

// Compress image task 
// -->>> Images type
// gifsicle — Compress GIF images
// mozjpeg — Compress JPEG images
// optipng — Compress PNG images
// svgo — Compress SVG images

async function compress_images(){
  return gulp.src('src/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browsersync.stream())
}

// the Watch function for compile any file inside the watch function
function watch() {
  browsersync.init({
    server: {
      baseDir: './dist/',
    }
  }),
    
  gulp.watch('src/**/*.pug', pug_compile);
  gulp.watch('src/scss/**/*.scss', styles);
  gulp.watch('src/images/**/*.*', compress_images);
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('./*.pug').on('change', browsersync.reload);
}


exports.default = gulp.series(
  pug_compile,
  gulp.parallel([styles]),
  scripts,
  compress_images,
  watch
)
// ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
