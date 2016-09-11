var gulp = require('gulp');
var gulp = require('gulp');

var minify = require('gulp-minify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');

gulp.task('minify-js', function() {
    gulp.src('public/**/*.js')
    .pipe(minify({ noSource : false,
                   ext:{
                    min: ".min.js"
                }}))
    .pipe(gulp.dest('./dist/public'));
});

gulp.task('minify-html', function() {
    return gulp.src('public/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/public'));  
})

gulp.task('minify-css', function() {
  return gulp.src('public/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8',ext:{
            min: ".min.js"
        }}))
    .pipe(gulp.dest('./dist/public'));
});


gulp.task('other',function(){
 return gulp.src(['./public/loader.svg','./public/circle-with-check-symbol.png','./public/listly-error.png'])
  .pipe(gulp.dest('./dist/public'));
});



gulp.task('default', ['minify-js',"minify-html","minify-css","other"]);






