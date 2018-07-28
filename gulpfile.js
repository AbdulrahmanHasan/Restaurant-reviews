const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
const browserSync = require('browser-sync').create();

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
});

// Styles
gulp.task('styles', () =>
  gulp
    .src('./src/css/*.css')
    .pipe(
      plumber(function(err) {
        console.log('Styles Task Error');
        console.log(err);
        this.emit('end');
      }),
    )
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(cleanCSS({ level: '2' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      sourcemaps.write('./', {
        sourceMappingURL(file) {
          return `${file.relative}.map`;
        },
      }),
    )
    .pipe(gulp.dest('./public/css/')),
);

// JavaScript
gulp.task('minify-js', () =>
  gulp
    .src('./src/js/*.js')
    .pipe(
      plumber(function(err) {
        console.log('JavaScript Task Error');
        console.log(err);
        this.emit('end');
      }),
    )
    .pipe(sourcemaps.init())
    .pipe(
      minify({
        ext: {
          src: '-debug.js',
          min: '.min.js',
        },
        noSource: true,
      }),
    )
    .pipe(
      sourcemaps.write('./', {
        sourceMappingURL(file) {
          return `${file.relative}.map`;
        },
      }),
    )
    .pipe(gulp.dest('./public/js/')),
);

// Build task
gulp.task('build', ['styles', 'minify-js'], () => {
  console.log('Building Project.');
});

// Watch task runner
gulp.task('watch', ['browser-sync', 'build'], () => {
  console.log('Starting watch task');
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp
    .watch('/src/css/styles.css', ['styles'])
    .on('change', browserSync.reload);
  gulp
    .watch(['main.js', 'dbhelper.js', 'restaurant_info.js'], ['minify-js'])
    .on('change', browserSync.reload);
});
