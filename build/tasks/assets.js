var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var copy = require('gulp-copy');
var rename = require('gulp-rename');
var paths = require('../paths');

gulp.task('styles', function(){
	gulp.src(paths.styles)
				// Copy wont pipe
				// https://github.com/klaascuvelier/gulp-copy/issues/2
			   .pipe(copy('dist/assets/less', {
			   		prefix: 2 // ignore src/less/ part of the path
			   	}));

   return gulp.src(paths.lessEntry)
			   .pipe(less())
			   .pipe(gulp.dest('dist/assets/css'))
			   .pipe(minifyCss())
			   .pipe(rename({
			   		suffix: '.min'
			   	}))
			   .pipe(gulp.dest('dist/assets/css'));
});
