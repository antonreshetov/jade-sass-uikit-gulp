var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var jade         = require('gulp-jade');
var watch        = require('gulp-watch');
var clean        = require('gulp-clean');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var concat       = require("gulp-concat");
var order        = require("gulp-order");
var merge        = require('merge-stream');
var htmlpretty   = require('gulp-prettify');
var notify       = require("gulp-notify");

// Error Handler
function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}

// Browser Sync
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        browser: "google chrome",
        notify: false
    });
});

// Copy Assets File
gulp.task('copyfiles', function() {
  var img = gulp.src('src/assets/img/*')
    .pipe(watch('src/assets/img/*'))
    .pipe(gulp.dest('app/assets/img'));
  var fonts = gulp.src('src/assets/fonts/*')
    .pipe(watch('src/assets/fonts/*'))
    .pipe(gulp.dest('app/assets/fonts'));

  return merge(img, fonts);
});

// SCSS to CSS + Prefix + Sourcemap
gulp.task('css', function() {
  return gulp.src('src/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({browsers: ['last 15 versions']}))
    .pipe(gulp.dest('app/assets/css'))
    // compressed
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 15 versions']}))
    .pipe(rename({
      suffix: '.min'
      }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

// Jade to Html
gulp.task('jade', function(){
  return gulp.src('src/jade/*.jade')
    .pipe(jade({
      pretty: true
      }))
    .on('error', swallowError)
    .on('error', notify.onError({
        message: 'Error: <%= error.message %>',
        sound: "Basso"
      }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream:true}));
});

// HTML Prettify
gulp.task('htmlpretty', function() {
  gulp.src('app/**/*.html')
    .pipe(htmlpretty({indent_size: 2, wrap_line_length: 0}))
    .pipe(gulp.dest('app'));
});

// JS Concat + Uglify
// To Add components/*.js just copy file to lib/
gulp.task('jsConcat', ['jsMain'], function() {
  return gulp.src('./src/assets/js/lib/*.js')
    .pipe(order([
      "src/assets/js/lib/jquery-1.11.2.min.js",
      "src/assets/js/lib/uikit.js",
      "src/assets/js/lib/*.js",
    ],{ base: './' }))
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
      }))
    .pipe(gulp.dest('app/assets/js'));
});

gulp.task('jsMain',function(){
  return gulp.src('./src/assets/js/main.js')
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .on('error', swallowError)
    .on('error', notify.onError({
        message: 'Error: <%= error.message %>',
        sound: "Basso"
      }))
    .pipe(rename({
      suffix: '.min'
      }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

// JsHint
gulp.task('lint', function() {
  return gulp.src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Watch
gulp.task('watch', function(){
  gulp.watch('src/assets/scss/**/*.scss',['css']);
  gulp.watch('src/jade/**/*.jade',['jade']);
  gulp.watch('src/assets/js/main.js',['jsMain']);
});

// Clean app
gulp.task('clean', function () {
  return gulp.src('app', {force: true})
    .pipe(clean());
});

// Run Default
gulp.task('default',['browserSync', 'css', 'jade', 'jsConcat', 'copyfiles', 'watch']);
