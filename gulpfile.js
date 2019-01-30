var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var inject = require('gulp-inject');

gulp.task('hello', function() {
  console.log('Hello Sam');
});

// 
// gulp.task('useref', function(){
//   return gulp.src('app/*.html')
//     .pipe(useref())
//     .pipe(gulp.dest('dist'))
// });

gulp.task('minifyjs', function () {
  return gulp.src('app/app/app.js') // Get source files with gulp.src
    .pipe(aGulpPlugin()) // Sends it through a gulp plugin
    .pipe(gulp.dest('dist/js/app.min.js')) // Outputs the file in the destination folder
})